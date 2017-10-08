$(document).ready(function(){

  var selectedRecipes = [];
      
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
    $("#recipes-wrapper").empty();

    recipes.forEach(function(recipe){
      var name = recipe.name;
      var image = recipe.image;
      var link = recipe.link;
      var dataPoints = recipe.dataPoints;
      var id = getRecipeId(link);
      console.log("id", id);
      
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

  $("#recipe-search").on("change", "input:checkbox", function(){
    var recipeId = $(this).attr("data-recipe-id");
    var recipePanel = $("#" + recipeId);

    if($(this).prop("checked") === true){
      if(selectedRecipes.indexOf(recipeId) === -1){
        selectedRecipes.push(recipeId);
        $("#selected-recipes-wrapper").append(recipePanel);
      }
    }
    else if($(this).prop("checked") === false){
      var index = selectedRecipes.indexOf(recipeId);
      selectedRecipes.splice(index, 1);
      $("#recipes-wrapper").append(recipePanel);
    }

    console.log("array", selectedRecipes);
  });

});