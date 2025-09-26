const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Aquí pones tu clave secreta de Stripe
const stripe = Stripe('sk_test_51SBLtI0gX3Yktc5tvvSwyIq3TfHynuTPTeQsnQ1fI4TvQaCD3YSD1ZTeTOouS8PIfqsHAyszVbGmDuyMDJoA00fA7sEof8');

app.use(cors());
app.use(bodyParser.json());

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
          unit_amount: Math.round(precio * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://tu-github-pages.io/exito.html',
      cancel_url: 'https://tu-github-pages.io/cancelado.html'
    });

    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la sesión' });
  }
});

app.listen(4242, () => console.log('Servidor Stripe corriendo en puerto 4242'));