$(document).ready(function(){

  // var selectedRecipes = [];

  var searchResultRecipesMap = {};
  var selectedRecipesMap = {};

  var groceryList = {};

  function Recipe(id, name, link, image, ingredients, servings){
    this.id = id,
    this.name = name,
    this.link = link,
    this.image = image,
    this.ingredients = ingredients,
    this.servings = servings
  }

  function Ingredient(name, amount, unit, aisle, upcCode){
    this.name = name,
    this.amount = amount,
    this.unit = unit,
    this.aisle = aisle,
    this.upcCode = upcCode
  }
      
  $("#search").on("click", function(){
    var recipeName = $("#search-input").val().trim();

    // $.ajax({
    //   type: "GET",
    //   url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/site/search",
    //   dataType: "json",
    //   data: jQuery.param({query: recipeName}),
    //   headers: {
    //     'X-Mashape-Key': 'LvriMxRsKAmshM4K2IHnxi8ZrwOUp1mrqSCjsnsOdiLEfjwK75'
    //   }
    // }).done(function(response) {
    //   // console.log("response", JSON.stringify(response));
    //   console.log("response", response);
    //   displayRecipes(response);
    // });

    // displayRecipes(searchResponse);
//********************************************************************************
    $.ajax({
      type: "GET",
      url: "http://maps.googleapis.com/maps/api/geocode/json",
      dataType: "json",
      data: jQuery.param({address: recipeName}),
      // headers: {
      //   'X-Mashape-Key': 'AIzaSyDjP--GrhczCJ2GpCJ5_TrCfG3KEooXf5s'
      // }
    }).done(function(response) {
      // console.log("response", JSON.stringify(response));
      console.log("response", response);
      // displayRecipes(response);
      console.log(response.results[0].geometry.location.lat);
      console.log(response.results[0].geometry.location.lng);
    var latitude = response.results[0].geometry.location.lat
    var longitude = response.results[0].geometry.location.lng
    initMap(latitude, longitude);
    });
    
//***************************************************************
   function initMap(latitude, longitude) {
        // preventDefault();
        var uluru = {lat: latitude, lng: longitude};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
      
//***************************************************************
});
 
  $("#generateGroceryList").on("click", function(){
    var recipeIds = "";
    Object.keys(selectedRecipesMap).forEach(function(id){
      recipeIds += id + ",";
    });

    recipeIds = recipeIds.slice(0, recipeIds.length-1);
    // console.log("recipeIds", recipeIds);

    // $.ajax({
    //   type: "GET",
    //   url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk",
    //   dataType: "json",
    //   data: jQuery.param({ids: recipeIds, includeNutrition: false}),
    //   headers: {
    //     'X-Mashape-Key': 'LvriMxRsKAmshM4K2IHnxi8ZrwOUp1mrqSCjsnsOdiLEfjwK75'
    //   }
    // }).done(function(response) {
    //   console.log("response String", JSON.stringify(response));
    //   console.log("response", response);
    // });

    var response = JSON.parse(recipesFullInfo);
    console.log("response", response);
    getIngredients(response);
  });


  function getIngredients(response){
    response.forEach(function(recipe){

      var recipeObj = recipe;
      
      var recipeId = recipeObj.id;
      var servings = recipeObj.servings;

      var ingredientsArray = [];
      recipeObj.extendedIngredients.forEach(function(ingredient){  
        ingredientsArray.push(new Ingredient(ingredient.name, ingredient.amount, ingredient.unitLong, ingredient.aisle, null));
      });


      // always select first two recipes for testing / it will throw error since it is taking from the response file.
      var selectedRecipeObj = selectedRecipesMap[recipeId];
      console.log("selectedRecipeObj", selectedRecipeObj);
      selectedRecipeObj['ingredients'] = ingredientsArray;
      selectedRecipeObj['servings'] = servings;

      // getUPCCodeFromIngredients(selectedRecipeObj);

    });
    
  }

  function getUPCCodeFromIngredients(recipe){
    var servingSize = recipe.servings;
    var ingredientsNames = [];
    recipe.ingredients.forEach(function(ingredient){
      ingredientsNames.push(ingredient.name);
    });

    var dataPayload = {
      "ingredients": ingredientsNames,
      "servings": servingSize
    };

    // console.log(ingredientsNames, servingSize);

    // $.ajax({
    //   type: "POST",
    //   url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/map",
    //   dataType: "json",
    //   data: JSON.stringify(dataPayload),
    //   headers: {
    //     'X-Mashape-Key': 'LvriMxRsKAmshM4K2IHnxi8ZrwOUp1mrqSCjsnsOdiLEfjwK75'
    //   }
    // }).done(function(response) {
    //   console.log("response String", JSON.stringify(response));
    //   console.log("response", response);
    // });

    var response1 = JSON.parse(recipe_1_UPCs);
    var response2 = JSON.parse(recipe_2_UPCs);
    console.log("response1", response1);
    console.log("response2", response2);

    response1.forEach(function(ingredient){
      console.log(ingredient);
      ingredient.products.forEach(function(product){
        // console.log(product);
        var title = product.title;
        var upc = product.upc;
        console.log(title, upc);
      });
    });

  }

  function displayRecipes(searchResponse){
    var recipes = searchResponse.Recipes;
    $("#recipes-wrapper").empty();
    searchResultRecipesMap = {};

    recipes.forEach(function(recipe){
      var name = recipe.name;
      var image = recipe.image;
      var link = recipe.link;
      var dataPoints = recipe.dataPoints;
      var id = getRecipeId(link);
      searchResultRecipesMap[id] = new Recipe(id, name, link, image, null, null);
      
      var recipePanel = $("<div>").addClass("panel panel-default").attr("id" , id);
      var recipeHeader = $("<div>").addClass("panel-heading");
      var recipeBody = $("<div>").addClass("panel-body");

      var recipeName = $("<h3>").addClass("panel-title").text(name).addClass("display-recipe");
      var checkBoxSpan = $("<span>").addClass("input-group-addon");
      var inputCheckBox = $("<input>").attr({"type": "checkbox", "data-recipe-id": id});
      recipeHeader.append(inputCheckBox);
      recipeHeader.append(recipeName);

      var recipeImg = $("<img>").attr("src", image).addClass("recipe-image");
      var recipeImgLink = $("<a>").attr("href", link).attr('target','_blank').append(recipeImg);
      
      var recipeInfoTable = getRecipeInfoTable(dataPoints);
      recipeInfoTable.addClass("display-recipe");

      recipeBody.append(recipeImgLink);
      recipeBody.append(recipeInfoTable);

      recipePanel.append(recipeHeader);      
      recipePanel.append(recipeBody);

      $("#recipes-wrapper").append(recipePanel);
    });

    console.log("searchResultRecipesMap", searchResultRecipesMap);
  }

  function getRecipeId(link){
    var idStartIndex = link.lastIndexOf("-") + 1;
    return link.substring(idStartIndex, link.length);
  }

  function getRecipeInfoTable(dataPoints){
    var table = $("<table>");
    dataPoints.forEach(function(dataPoint){
      var row = $("<tr>");
      row.append($("<td>").text(dataPoint.key));
      row.append($("<td>").text(dataPoint.value));
      table.append(row);
    });
    return table;
  }

  $("#recipes-wrapper").on("change", "input:checkbox", function(){
    var recipeId = $(this).attr("data-recipe-id");
    var recipePanel = $("#" + recipeId);

    if($(this).prop("checked") === true){
      if(Object.keys(selectedRecipesMap).indexOf(recipeId) === -1){

        selectedRecipesMap[recipeId] = searchResultRecipesMap[recipeId];
        delete searchResultRecipesMap[recipeId];

        recipePanel.attr("id", "selected-"+ recipeId);
        $("#selected-recipes-wrapper").append(recipePanel);
      }
    }
  });

  $("#selected-recipes-wrapper").on("change", "input:checkbox", function(){
    var recipeId = $(this).attr("data-recipe-id");
    var recipePanel = $("#selected-" + recipeId);

    if($(this).prop("checked") === false){

      if(Object.keys(searchResultRecipesMap).indexOf(recipeId) === -1){
        searchResultRecipesMap[recipeId] = selectedRecipesMap[recipeId];
        recipePanel.attr("id", recipeId);
        $("#recipes-wrapper").append(recipePanel);
      }
      else{
        recipePanel.remove();
      }
      delete selectedRecipesMap[recipeId];
      $("input[data-recipe-id="+ recipeId +"]").prop('checked', false);
    }
  });

});