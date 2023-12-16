const express = require('express');
const Xray = require('x-ray');
const app = express();
const PORT = process.env.PORT || 5000;
const x = Xray();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Amazon Scraper API.');
});

// Get Product Details
app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const response = await x(`https://www.amazon.com/dp/${productId}`, 'body', {
      title: '#title_feature_div #productTitle',
      price: '.a-section .a-price-whole',
      reviews: '#acrCustomerReviewLink .a-size-base',
      productDetails: {
        Brand: '#poExpander .a-span9',
        Model: '#poExpander .po-model-name',
        modelName: '.po-model_name :nth-child(2)',
        screenSize: '.po-display.size :nth-child(2)',
        color: '.po-color :nth-child(2)',
        hardDisk: '.a-span9 .po-break-word',
        feature: '.po-operating_system :nth-child(2)',
        spetialFeature: '.po-special_feature :nth-child(2)',
        description: '.po-graphics_description :nth-child(2)',
        soldBy: '.offer-display-feature-text .offer-display-feature-text-message',
        shipsFrom: '.offer-display-feature-text .offer-display-feature-text-message'
      },
      globalPrice: '.a-popover-content .a-text-left',
      image: '.imgTagWrapper img@src',
    });

    res.json(response);
  } catch (error) {
    res.json({ error: error.message });
  }
});



//Get Search Result
app.get('/search/:searchQuery', async (req, res) => {
  const { searchQuery } = req.params;
  try {
    const response = await x(`https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`, 'body', [
      {
        products: x('.sg-col-inner', [
          {
            title: '.a-color-base.a-text-normal',
            image:'.s-image@src',
            price: '.a-price-whole', // Replace this with the actual selector for the price
            starRating:'.aok-align-bottom'
          }
        ])
      }
    ]);
    

    res.json(response);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
