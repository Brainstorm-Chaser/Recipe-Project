$(document).ready(function(){

  // var selectedRecipes = [];

  var searchResultRecipesMap = {};
  var selectedRecipesMap = {};

  var groceryList = {};

  function Recipe(id, name, link, image, ingredients){
    this.id = id,
    this.name = name,
    this.link = link,
    this.image = image,
    this.ingredients = ingredients
  }

  function Ingredient(name, quantity, amount, unit, aisle, upcCode){
    this.name = name,
    this.quantity = quantity,
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

    displayRecipes(searchResponse);

  });

  $("#generateGroceryList").on("click", function(){


  });

  function displayRecipes(searchResponse){
    var recipes = searchResponse.Recipes;
    $("#recipes-wrapper").empty();

    recipes.forEach(function(recipe){
      var name = recipe.name;
      var image = recipe.image;
      var link = recipe.link;
      var dataPoints = recipe.dataPoints;
      var id = getRecipeId(link);
      searchResultRecipesMap[id] = new Recipe(id, name, link, image, null);
      
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

    console.log(searchResultRecipesMap);
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
      console.log("keys",Object.keys(selectedRecipesMap));
      if(Object.keys(selectedRecipesMap).indexOf(recipeId) === -1){

        selectedRecipesMap[recipeId] = searchResultRecipesMap[recipeId];
        delete searchResultRecipesMap[recipeId];

        recipePanel.attr("id", "selected-"+ recipeId);
        $("#selected-recipes-wrapper").append(recipePanel);
      }
    }
    // console.log("selected", selectedRecipesMap);
    // console.log("search", searchResultRecipesMap);
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