import { Router } from 'express';
const axios = require("axios");

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

routes.get('/hi', async (req, res) => {

  try {

    //all the request we need...
    const [first, second,third, forth, fith] = await Promise.all([
      axios("https://sv443.net/jokeapi/v2/joke/Any"),
      axios("https://api.punkapi.com/v2/beers/random"),
      axios("http://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3"),
      axios("http://taco-randomizer.herokuapp.com/random/"),
      axios("https://api-adresse.data.gouv.fr/search/?q=41+rue+du+port+Lille")
    ]);

    function catFact() {
      //creating a list containing for each element a cat fact.
      const result = third.data.map(element => {
        return JSON.stringify(element.text)
      });
      return result
      }
      // creating a list containing latitude and longitude
      const coordinates = fith.data.features[0].geometry.coordinates.map(element => {
         return element;
      });

    const lat = coordinates[0];
    const long = coordinates[1];
    const final_joke = JSON.stringify(first.data.setup + " " +  first.data.delivery, null, 2);
    const the_beer_name = JSON.stringify(second.data[0].name, null, 2);
    const the_beer_description = JSON.stringify(second.data[0].description, null, 2);
    const tacos = JSON.stringify(forth.data.condiment.recipe, null, 2);
    const cat_fact = catFact();
    // replacing \n in JSON by ''
    const result = {
        gps: {lat: lat, long:long},
        joke:final_joke.replace(/\\n/g, ''),
        beer:{
          name:the_beer_name.replace(/\\n/g, ''),
          description:the_beer_description.replace(/\\n/g, '')
        },
        tacos:tacos.replace(/\\n/g, ''),
        fact:cat_fact
      };

    res.send(result)
    ;
  }catch (e) {
    console.log("something went wrong... "  + e)
  }


});

export default routes;
