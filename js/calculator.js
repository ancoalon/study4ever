(function () {
  // Secret: 6 7 6 7 then Clear (C)
  const SECRET_SEQUENCE = ['2', '0', '1', '4', 'C'];
  let keySequence = [];
  let current = '0';
  let previous = null;
  let operation = null;
  let newNumber = true;

  const display = document.getElementById('calcDisplay');
  const calcExpr = document.getElementById('calcExpr');

  function updateDisplay(value) {
    const str = String(value);
    display.textContent = str.length > 12 ? Number(value).toExponential(6) : str;
  }

  function commitNumber() {
    if (previous === null) return;
    let result;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    switch (operation) {
      case '+': result = a + b; break;
      case '−':
      case '-': result = a - b; break;
      case '×': result = a * b; break;
      case '÷': result = b === 0 ? 'Error' : a / b; break;
      default: return;
    }
    current = result === 'Error' ? '0' : String(result);
    previous = null;
    operation = null;
    newNumber = true;
    updateDisplay(current);
  }

  function pushKey(key) {
    keySequence.push(key);
    if (keySequence.length > SECRET_SEQUENCE.length) keySequence.shift();
    if (keySequence.length === SECRET_SEQUENCE.length &&
        keySequence.every((k, i) => k === SECRET_SEQUENCE[i])) {
      if (typeof window.openResourcesModal === 'function') {
        window.openResourcesModal();
      } else {
        window.location.href = 'resources.html';
      }
      return true;
    }
    return false;
  }

  function evaluateExpression(expr) {
    const raw = String(expr || '').trim();
    if (!raw) return null;

    // Prefer math.js when available (supports pi, sqrt, etc.)
    if (typeof math !== 'undefined' && math && typeof math.evaluate === 'function') {
      return math.evaluate(raw);
    }

    // Fallback: tiny parser/evaluator (NO eval/Function).
    // Supports: + - * / % ( ) ,  ^ or **, constants pi/e,
    // and functions: sqrt,sin,cos,tan,log (base10),ln,abs,min,max,round,floor,ceil,pow
    const allowed = /^[0-9+\-*/%().,\sA-Za-z^×÷−]+$/;
    if (!allowed.test(raw)) throw new Error('Invalid characters');

    const s = raw
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    const CONSTANTS = { pi: Math.PI, e: Math.E };
    const FUNCS_1 = {
      sqrt: (x) => Math.sqrt(x),
      sin: (x) => Math.sin(x),
      cos: (x) => Math.cos(x),
      tan: (x) => Math.tan(x),
      abs: (x) => Math.abs(x),
      round: (x) => Math.round(x),
      floor: (x) => Math.floor(x),
      ceil: (x) => Math.ceil(x),
      log: (x) => (Math.log10 ? Math.log10(x) : Math.log(x) / Math.LN10),
      ln: (x) => Math.log(x)
    };
    const FUNCS_2 = {
      pow: (a, b) => Math.pow(a, b),
      min: (a, b) => Math.min(a, b),
      max: (a, b) => Math.max(a, b)
    };

    function tokenize(input) {
      const tokens = [];
      let i = 0;
      while (i < input.length) {
        const ch = input[i];
        if (/\s/.test(ch)) { i++; continue; }
        // number
        if (/[0-9.]/.test(ch)) {
          let j = i;
          let dot = 0;
          while (j < input.length && /[0-9.]/.test(input[j])) {
            if (input[j] === '.') dot++;
            if (dot > 1) break;
            j++;
          }
          const numStr = input.slice(i, j);
          const num = Number(numStr);
          if (!Number.isFinite(num)) throw new Error('Bad number');
          tokens.push({ t: 'num', v: num });
          i = j;
          continue;
        }
        // identifier
        if (/[A-Za-z]/.test(ch)) {
          let j = i;
          while (j < input.length && /[A-Za-z]/.test(input[j])) j++;
          tokens.push({ t: 'id', v: input.slice(i, j).toLowerCase() });
          i = j;
          continue;
        }
        // operators / punctuation
        if (ch === '*' && input[i + 1] === '*') {
          tokens.push({ t: 'op', v: '**' });
          i += 2;
          continue;
        }
        if ('+-*/%^(),'.includes(ch)) {
          tokens.push({ t: 'op', v: ch });
          i++;
          continue;
        }
        throw new Error('Bad char');
      }
      return tokens;
    }

    function toRpn(tokens) {
      const out = [];
      const ops = [];
      const parenIsFunc = [];
      const callStack = [];

      function prec(op) {
        if (op === 'u+' || op === 'u-') return 4;
        if (op === '^' || op === '**') return 3;
        if (op === '*' || op === '/' || op === '%') return 2;
        if (op === '+' || op === '-') return 1;
        return 0;
      }
      function rightAssoc(op) {
        return op === '^' || op === '**' || op === 'u+' || op === 'u-';
      }

      let lastWasValue = false;
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.t === 'num') {
          out.push(tok);
          lastWasValue = true;
          if (callStack.length && callStack[callStack.length - 1].argc === 0) callStack[callStack.length - 1].argc = 1;
          continue;
        }

        if (tok.t === 'id') {
          const next = tokens[i + 1];
          if (next && next.t === 'op' && next.v === '(') {
            // function call
            const name = tok.v;
            if (!FUNCS_1[name] && !FUNCS_2[name]) throw new Error('Unknown function');
            ops.push({ t: 'func', v: name, argc: 0 });
            callStack.push({ name: name, argc: 0 });
            lastWasValue = false;
          } else {
            // constant
            if (!(tok.v in CONSTANTS)) throw new Error('Unknown identifier');
            out.push({ t: 'num', v: CONSTANTS[tok.v] });
            lastWasValue = true;
            if (callStack.length && callStack[callStack.length - 1].argc === 0) callStack[callStack.length - 1].argc = 1;
          }
          continue;
        }

        // operators/punctuation
        const v = tok.v;
        if (v === '(') {
          // mark whether this paren opens a function call
          const isFunc = ops.length && ops[ops.length - 1].t === 'func';
          parenIsFunc.push(!!isFunc);
          ops.push({ t: 'op', v: '(' });
          lastWasValue = false;
          continue;
        }
        if (v === ',') {
          while (ops.length && !(ops[ops.length - 1].t === 'op' && ops[ops.length - 1].v === '(')) {
            out.push(ops.pop());
          }
          if (!ops.length) throw new Error('Comma outside call');
          if (!lastWasValue) throw new Error('Missing argument');
          if (!callStack.length) throw new Error('Comma outside call');
          callStack[callStack.length - 1].argc += 1;
          lastWasValue = false;
          continue;
        }
        if (v === ')') {
          while (ops.length && !(ops[ops.length - 1].t === 'op' && ops[ops.length - 1].v === '(')) {
            out.push(ops.pop());
          }
          if (!ops.length) throw new Error('Mismatched )');
          ops.pop(); // pop '('
          const wasFunc = parenIsFunc.pop();
          if (wasFunc) {
            const cs = callStack.pop();
            if (!cs || cs.argc === 0) throw new Error('Missing argument');
            // if there were commas, argc is commas+1; otherwise argc was set to 1 when first value appeared
            const argc = cs.argc;
            const fnTok = ops.pop();
            if (!fnTok || fnTok.t !== 'func') throw new Error('Bad function');
            fnTok.argc = argc;
            out.push(fnTok);
          }
          lastWasValue = true;
          if (callStack.length && callStack[callStack.length - 1].argc === 0) callStack[callStack.length - 1].argc = 1;
          continue;
        }

        // operator (+-*/%^ or **)
        if ('+-*/%^'.includes(v) || v === '**') {
          let op = v;
          if ((op === '+' || op === '-') && !lastWasValue) {
            op = op === '+' ? 'u+' : 'u-';
          }
          while (ops.length) {
            const top = ops[ops.length - 1];
            if (top.t !== 'op' || top.v === '(') break;
            const pTop = prec(top.v);
            const pOp = prec(op);
            if (pTop > pOp || (pTop === pOp && !rightAssoc(op))) out.push(ops.pop());
            else break;
          }
          ops.push({ t: 'op', v: op });
          lastWasValue = false;
          continue;
        }

        throw new Error('Bad token');
      }

      while (ops.length) {
        const top = ops.pop();
        if (top.t === 'op' && top.v === '(') throw new Error('Mismatched (');
        out.push(top);
      }
      return out;
    }

    function evalRpn(rpn) {
      const st = [];
      for (const tok of rpn) {
        if (tok.t === 'num') {
          st.push(tok.v);
          continue;
        }
        if (tok.t === 'op') {
          if (tok.v === 'u+' || tok.v === 'u-') {
            if (st.length < 1) throw new Error('Stack');
            const a = st.pop();
            st.push(tok.v === 'u-' ? -a : +a);
            continue;
          }
          if (st.length < 2) throw new Error('Stack');
          const b = st.pop();
          const a = st.pop();
          switch (tok.v) {
            case '+': st.push(a + b); break;
            case '-': st.push(a - b); break;
            case '*': st.push(a * b); break;
            case '/': st.push(a / b); break;
            case '%': st.push(a % b); break;
            case '^':
            case '**': st.push(Math.pow(a, b)); break;
            default: throw new Error('Op');
          }
          continue;
        }
        if (tok.t === 'func') {
          const name = tok.v;
          const argc = tok.argc || 0;
          if (FUNCS_1[name]) {
            if (argc !== 1 || st.length < 1) throw new Error('Arg');
            st.push(FUNCS_1[name](st.pop()));
          } else if (FUNCS_2[name]) {
            if (argc !== 2 || st.length < 2) throw new Error('Arg');
            const b = st.pop();
            const a = st.pop();
            st.push(FUNCS_2[name](a, b));
          } else {
            throw new Error('Fn');
          }
          continue;
        }
        throw new Error('Bad');
      }
      if (st.length !== 1) throw new Error('Bad expr');
      return st[0];
    }

    const tokens = tokenize(s);
    const rpn = toRpn(tokens);
    return evalRpn(rpn);
  }

  function setDisplayValue(value) {
    const str = String(value);
    updateDisplay(str);
    current = str === 'Error' ? '0' : str;
    previous = null;
    operation = null;
    newNumber = true;
  }

  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const action = this.dataset.action;
      const num = this.dataset.num;
      const op = this.dataset.op;
      const fn = this.dataset.fn;

      if (num !== undefined) {
        if (pushKey(num)) return;
        if (newNumber) { current = num === '.' ? '0.' : num; newNumber = false; }
        else {
          if (num === '.' && current.includes('.')) return;
          if (num === '.' && current === '0') { current = '0.'; updateDisplay(current); return; }
          if (current === '0' && num !== '.') current = num;
          else current += num;
        }
        updateDisplay(current);
        return;
      }

      if (op !== undefined) {
        if (pushKey(op)) return;
        if (previous !== null && !newNumber) commitNumber();
        previous = current;
        operation = op === '×' ? '×' : op === '÷' ? '÷' : op === '−' ? '−' : op;
        newNumber = true;
        return;
      }

      if (action === 'equals') {
        if (pushKey('=')) return;
        commitNumber();
        return;
      }

      if (action === 'clear') {
        // Allow secret to end with Clear (C)
        if (pushKey('C')) return;
        keySequence = [];
        current = '0';
        previous = null;
        operation = null;
        newNumber = true;
        updateDisplay(current);
        return;
      }

      if (action === 'toggle') {
        current = String(-parseFloat(current));
        updateDisplay(current);
        return;
      }

      if (action === 'percent') {
        current = String(parseFloat(current) / 100);
        updateDisplay(current);
        return;
      }

      if (fn) {
        const x = parseFloat(current);
        let result;
        switch (fn) {
          case 'sin': result = Math.sin(x * Math.PI / 180); break;
          case 'cos': result = Math.cos(x * Math.PI / 180); break;
          case 'tan': result = Math.tan(x * Math.PI / 180); break;
          case 'sqrt': result = x < 0 ? 'Error' : Math.sqrt(x); break;
          case 'pow': result = x * x; break;
          case 'log': result = x <= 0 ? 'Error' : Math.log10(x); break;
          case 'ln': result = x <= 0 ? 'Error' : Math.log(x); break;
          case 'pi': result = Math.PI; break;
          case 'e': result = Math.E; break;
          default: return;
        }
        current = result === 'Error' ? '0' : String(result);
        newNumber = true;
        updateDisplay(current);
      }
    });
  });

  // Expression bar: evaluate on Enter (math.js if available, otherwise fallback)
  if (calcExpr) {
    calcExpr.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const expr = (calcExpr.value || '').trim();
      if (!expr) return;
      try {
        const result = evaluateExpression(expr);
        if (typeof result === 'number' && !Number.isFinite(result)) throw new Error('Bad result');
        setDisplayValue(result);
        calcExpr.value = '';
      } catch (err) {
        updateDisplay('Error');
        current = '0';
        previous = null;
        operation = null;
        newNumber = true;
      }
    });
  }
})();
