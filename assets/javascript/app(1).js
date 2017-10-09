$(document).ready(function(){

  $("#search").on("click", function(){
    var recipeName = $("#search-input").val();

    var urlSearch = "https://maps.googleapis.com/maps/api/geocode/json?address=walmart%20san%20francisco&key=AIzaSyDjP--GrhczCJ2GpCJ5_TrCfG3KEooXf5s";


//url: https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?diet=vegetarian&excludeIngredients=coconut&instructionsRequired=false&intolerances=egg%2C+gluten&limitLicense=false&number=10&offset=0&query=burger&type=main+course
 $.ajax({
    type: "GET",
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=walmart%20san%20francisco&key=AIzaSyDjP--GrhczCJ2GpCJ5_TrCfG3KEooXf5s',
    dataType: "json",
    headers: {
      'X-Mashape-Key': 'AIzaSyDjP--GrhczCJ2GpCJ5_TrCfG3KEooXf5s'
      // 'Accept: application/json'
    }
  }).done(function(response) {

    console.log(response);
    console.log(response[1]);
    // for (i=0;i<response.length;i++) {
    //   $('#recipeobj').append(response);
    // }

  });


 // var resObj =  {results: Array(10), baseUri: "https://spoonacular.com/recipeImages/", offset: 0, number: 10, totalResults: 50, …}baseUri: "https://spoonacular.com/recipeImages/"expires: 1507495966577isStale: falsenumber: 10offset: 0processingTimeMs: 281results: Array(10)0: id: 262682image: "thai-sweet-potato-veggie-burgers-with-spicy-peanut-sauce-262682.jpg"imageUrls: Array(1)0: "thai-sweet-potato-veggie-burgers-with-spicy-peanut-sauce-262682.jpg"length: 1__proto__: Array(0)concat: ƒ concat()constructor: ƒ Array()copyWithin: ƒ copyWithin()entries: ƒ entries()every: ƒ every()fill: ƒ fill()filter: ƒ filter()find: ƒ find()findIndex: ƒ findIndex()forEach: ƒ forEach()includes: ƒ includes()indexOf: ƒ indexOf()join: ƒ join()keys: ƒ keys()lastIndexOf: ƒ lastIndexOf()length: 0map: ƒ map()pop: ƒ pop()push: ƒ push()reduce: ƒ reduce()reduceRight: ƒ reduceRight()reverse: ƒ reverse()shift: ƒ shift()slice: ƒ slice()some: ƒ some()sort: ƒ sort()splice: ƒ splice()toLocaleString: ƒ toLocaleString()toString: ƒ toString()unshift: ƒ unshift()Symbol(Symbol.iterator): ƒ values()Symbol(Symbol.unscopables): {copyWithin: true, entries: true, fill: true, find: true, findIndex: true, …}__proto__: ObjectreadyInMinutes: 75title: "Thai Sweet Potato Veggie Burgers with Spicy Peanut Sauce"__proto__: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()1: id: 227961image: "Cajun-Spiced-Black-Bean-and-Sweet-Potato-Burgers-227961.jpg"imageUrls: ["Cajun-Spiced-Black-Bean-and-Sweet-Potato-Burgers-227961.jpg"]readyInMinutes: 20title: "Cajun Spiced Black Bean and Sweet Potato Burgers"__proto__: Object2: id: 602708image: "Meatless-Monday--Grilled-Portobello-Mushroom-Burgers-with-Romesco-and-Arugula-602708.jpg"imageUrls: ["Meatless-Monday--Grilled-Portobello-Mushroom-Burgers-with-Romesco-and-Arugula-602708.jpg"]readyInMinutes: 15title: "Meatless Monday: Grilled Portobello Mushroom Burgers with Romesco and Arugula"__proto__: Object3: id: 759739image: "gluten-free-veggie-burger-759739.jpg"imageUrls: ["gluten-free-veggie-burger-759739.jpg"]readyInMinutes: 45title: "Gluten-Free Veggie Burger"__proto__: Object4: id: 630255image: "Protein-Powerhouse-Veggie-Burgers-630255.jpg"imageUrls: ["Protein-Powerhouse-Veggie-Burgers-630255.jpg"]readyInMinutes: 95title: "Protein Powerhouse Veggie Burgers"__proto__: Object5: id: 479732image: "Meatless-Monday--Curried-Veggie-Burgers-with-Zucchini--Lentils--and-Quinoa-479732.jpg"imageUrls: ["Meatless-Monday--Curried-Veggie-Burgers-with-Zucchini--Lentils--and-Quinoa-479732.jpg"]readyInMinutes: 15title: "Meatless Monday: Curried Veggie Burgers with Zucchini, Lentils, and Quinoa"__proto__: Object6: id: 589724image: "Red-Lentil--Smashed-Chickpea-and-Millet-Burgers-589724.jpg"imageUrls: ["Red-Lentil--Smashed-Chickpea-and-Millet-Burgers-589724.jpg"]readyInMinutes: 80title: "Red Lentil, Smashed Chickpea and Millet Burgers"__proto__: Object7: id: 541691image: "black-bean-mole-burgers-541691.jpg"imageUrls: ["black-bean-mole-burgers-541691.jpg"]readyInMinutes: 45title: "Black Bean Mole Burgers"__proto__: Object8: id: 766301image: "queso-cheese-burgers-766301.jpg"imageUrls: ["queso-cheese-burgers-766301.jpg"]readyInMinutes: 60title: "Queso Cheese Burgers"__proto__: Object9: id: 506584image: "Chickpea-Sunflower-Seed-Burgers-506584.jpg"imageUrls: Array(1)0: "Chickpea-Sunflower-Seed-Burgers-506584.jpg"length: 1__proto__: Array(0)readyInMinutes: 45title: "Chickpea Sunflower Seed Burgers"__proto__: Objectlength: 10__proto__: Array(0)concat: ƒ concat()constructor: ƒ Array()copyWithin: ƒ copyWithin()entries: ƒ entries()every: ƒ every()fill: ƒ fill()filter: ƒ filter()find: ƒ find()findIndex: ƒ findIndex()forEach: ƒ forEach()includes: ƒ includes()indexOf: ƒ indexOf()join: ƒ join()keys: ƒ keys()lastIndexOf: ƒ lastIndexOf()length: 0map: ƒ map()pop: ƒ pop()push: ƒ push()reduce: ƒ reduce()reduceRight: ƒ reduceRight()reverse: ƒ reverse()shift: ƒ shift()slice: ƒ slice()some: ƒ some()sort: ƒ sort()splice: ƒ splice()toLocaleString: ƒ toLocaleString()toString: ƒ toString()unshift: ƒ unshift()Symbol(Symbol.iterator): ƒ values()Symbol(Symbol.unscopables): {copyWithin: true, entries: true, fill: true, find: true, findIndex: true, …}__proto__: ObjecttotalResults: 50__proto__: Object





});

});