const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hookStr = `
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const orderId = params.get('orderId');

    if (paymentStatus === 'success' && orderId) {
      alert('Plata a fost procesată cu succes! Comanda ta a fost plasată.');
      handleClearCart();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancel' && orderId) {
      alert('Plata a fost anulată. Comanda ta a rămas în stadiul de așteptare plată.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
`;

code = code.replace("const handleClearCart = () => {\n    setCartItems([]);\n  };", "const handleClearCart = () => {\n    setCartItems([]);\n  };\n" + hookStr);

fs.writeFileSync('src/App.tsx', code);
