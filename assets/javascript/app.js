$(document).ready(function(){
      
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

  function displayRecipes(searchResponse){
    var recipes = searchResponse.Recipes;

    recipes.forEach(function(recipe){
      var name = recipe.name;
      var image = recipe.image;
      var link = recipe.link;
      var dataPoints = recipe.dataPoints;
      var id = getRecipeId(link);
      console.log("id", id);
      
      var recipeDiv = $("<div>").addClass("panel panel-default");
      var recipeHeader = $("<div>").addClass("panel-heading");
      var recipeBody = $("<div>").addClass("panel-body");

      var recipeName = $("<h3>").addClass("panel-title").text(name);
      recipeHeader.html(recipeName);

      var recipeImg = $("<img>").attr("src", image).addClass("recipe-image");
      var recipeImgLink = $("<a>").attr("href", link).attr('target','_blank').append(recipeImg);
      
      var recipeInfoTable = getRecipeInfoTable(dataPoints);
      recipeInfoTable.addClass("display-recipe");

      recipeBody.append(recipeImgLink);
      recipeBody.append(recipeInfoTable);

      recipeDiv.append(recipeHeader);      
      recipeDiv.append(recipeBody);

      $("#recipes-wrapper").append(recipeDiv);
    });
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

});