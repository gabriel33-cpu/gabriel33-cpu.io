// server.js
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Usa la variable de entorno STRIPE_SECRET_KEY
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());

// Endpoint para crear sesión de Stripe
app.post('/create-checkout-session', async (req, res) => {
  const { nombre, precio } = req.body;

  if(!nombre || !precio){
    return res.status(400).json({ error: 'Faltan datos del servicio' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: nombre },
          unit_amount: Math.round(precio * 100) // Stripe usa céntimos
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://gabriel33-cpu.github.io/gabriel33-cpu.io/exito.html',
      cancel_url: 'https://gabriel33-cpu.github.io/gabriel33-cpu.io/cancelado.html'
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la sesión' });
  }
});

// Railway asigna un puerto dinámico
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Servidor Stripe corriendo en puerto ${PORT}`));
