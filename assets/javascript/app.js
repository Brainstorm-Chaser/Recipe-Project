// Initialize Firebase
var config = {
  apiKey: "AIzaSyBPvYj0xOUJBTtkZa4dxL8LmjE8PXeq6zg",
  authDomain: "recipe-collection-9b6b5.firebaseapp.com",
  databaseURL: "https://recipe-collection-9b6b5.firebaseio.com",
  projectId: "recipe-collection-9b6b5",
  storageBucket: "recipe-collection-9b6b5.appspot.com",
  messagingSenderId: "290123707471"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function(){

  var usersRef = database.ref("/users");

  var searchResultRecipesMap = {};
  var selectedRecipesMap = {};

  var userName = null;
  var email = null;
  var zipcode = null;

  var groceryListTable = null;

  function Recipe(id, name, link, image, ingredients, servings, kvtable){
    this.id = id,
    this.name = name,
    this.link = link,
    this.image = image,
    this.ingredients = ingredients,
    this.servings = servings,
    this.kvtable = kvtable
  }

  function Ingredient(name, amount, unit, aisle, possibleUnits){
    this.name = name,
    this.amount = amount,
    this.unit = unit,
    this.aisle = aisle,
    this.possibleUnits = possibleUnits
  }

  function GroceryItem(name, quantities, aisle){
    this.name = name,
    this.quantities = quantities,
    this.aisle = aisle
  }

  function Quantity(amount, unit, possibleUnits){
    this.amount = amount,
    this.unit = unit,
    this.possibleUnits = possibleUnits
  }
      
  $("#search").on("click", function(){
    var recipeName = $("#search-input").val().trim();

    if(recipeName !== ""){
      $.ajax({
        type: "GET",
        url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/site/search",
        dataType: "json",
        data: jQuery.param({query: recipeName}),
        headers: {
          'X-Mashape-Key': 'LvriMxRsKAmshM4K2IHnxi8ZrwOUp1mrqSCjsnsOdiLEfjwK75'
        }
      }).done(function(response) {
        displayRecipes(response);
      });
    }
  });

  $("#generateGroceryList").on("click", function(){
    $("#search-input").val('');

    var recipeIds = "";
    Object.keys(selectedRecipesMap).forEach(function(id){
      recipeIds += id + ",";
    });

    if(recipeIds !== ""){
      recipeIds = recipeIds.slice(0, recipeIds.length-1);

      $.ajax({
        type: "GET",
        url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk",
        dataType: "json",
        data: jQuery.param({ids: recipeIds, includeNutrition: false}),
        headers: {
          'X-Mashape-Key': 'LvriMxRsKAmshM4K2IHnxi8ZrwOUp1mrqSCjsnsOdiLEfjwK75'
        }
      }).done(function(response) {
        getIngredients(response);
      });
    }

  });


  function getIngredients(response){
    response.forEach(function(recipe){
      var recipeObj = recipe;
      var recipeId = recipeObj.id;
      var servings = recipeObj.servings;

      var ingredientsArray = [];

      recipeObj.extendedIngredients.forEach(function(ingredient){
        var possibleUnits = [ingredient.unit, ingredient.unitLong, ingredient.unitShort];
        ingredientsArray.push(new Ingredient(ingredient.name, ingredient.amount, ingredient.unitLong, 
          ingredient.aisle, possibleUnits));
      });

      var selectedRecipeObj = selectedRecipesMap[recipeId];
      selectedRecipeObj['ingredients'] = ingredientsArray;
      selectedRecipeObj['servings'] = servings;
    });

    var groceryList = generateGroceryList(selectedRecipesMap);
    displayGroceryList(groceryList);
    displayMap();
  }

  function displayMap(){
    var maplink = "https://www.google.com/maps/embed/v1/search?key=AIzaSyBmDYecXmk6UpvFwFF7UvUIIeUoch3PCoQ&q=grocery+" + zipcode ;
    $("#map-zip").attr("src", maplink);

    $("#map-window").show();
  }

  function generateGroceryList(selectedRecipesMap){

    var groceryList = {};
    
    Object.values(selectedRecipesMap).forEach(function(recipe){
      recipe.ingredients.forEach(function(ingredient){
        var ingredientName = ingredient.name;
        if(Object.keys(groceryList).indexOf(ingredientName) === -1){
          var quantities = [new Quantity(ingredient.amount, ingredient.unit, Array.from(ingredient.possibleUnits))];
          groceryList[ingredientName] = new GroceryItem(ingredientName, quantities, ingredient.aisle);
        }
        else{
          var groceryItem = groceryList[ingredientName];

          for(var index=0; index<groceryItem.quantities.length; index++){
            var quantity = groceryItem.quantities[index]; 
            var common = $.grep(quantity.possibleUnits, function(element) {
              return $.inArray(element, ingredient.possibleUnits ) !== -1;
            });

            var unitMatched = false;
            if(common.length !== 0){
              var totalAmount = eval(quantity.amount) + eval(ingredient.amount);
              groceryItem.quantities[index].amount = totalAmount;
              unitMatched = true;
              break;
            }
          }
          if(!unitMatched){
            // there is item, but unit does not match with existing item
            groceryItem.quantities.push(new Quantity(ingredient.amount, ingredient.unit, 
              Array.from(ingredient.possibleUnits)));
          }
        }
      });
    });
    return groceryList;
  }

  function displayGroceryList(groceryList){
    $("#grocery-list-wrapper").empty();
    
    var groceryItems = Object.values(groceryList);
    groceryItems.sort(function(a, b){
      var nameA = a.aisle;
      var nameB = b.aisle;
      return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    });

    var table = $("<table>").addClass("grocery-list");
    var tHead = $("<thead>");
    var tBody = $("<tbody>");
    table.append(tHead);
    table.append(tBody);

    var rowHeader = $("<tr>");
    rowHeader.append($("<th>").text('Name'));
    rowHeader.append($("<th>").text('Amount'));
    rowHeader.append($("<th>").text('Unit'));
    rowHeader.append($("<th>").text('Aisle'));
    tHead.append(rowHeader);

    groceryItems.forEach(function(ingredient){
      var quantities = ingredient.quantities;
      quantities.forEach(function(quantity){
        var amount = eval(quantity.amount);
        if(amount % 1 != 0){
          amount = amount.toFixed(4);
          if(eval(amount) === 0){
            amount = .1000;
          }
        }

        var row = $("<tr>");
        row.append($("<td>").text(ingredient.name));
        row.append($("<td>").text(amount));
        row.append($("<td>").text(quantity.unit));
        row.append($("<td>").text(ingredient.aisle));
        tBody.append(row);
      });
    });

    groceryListTable = table;

    $("#grocery-list-wrapper").html(table);
    
    showSelectedRecipes();

    $("#recipe-window").hide();
    $("#grocery-list-window").show();    
  }

  function showSelectedRecipes(){
    // hiding the check boxes
    $("#grocery-selected-recipes").append($("#selected-recipes-wrapper").html());
    $("input:checkbox").hide();

    // showing the serving size
    Object.values(selectedRecipesMap).forEach(function(recipe){
      var span = $("<span>").text("Servings: " + recipe.servings).addClass("servings");
      $("#selected-" + recipe.id + "> .panel-heading").append(span);
    });
  }

  function displayRecipes(searchResponse){
    var recipes = searchResponse.Recipes;
    $("#recipes-wrapper").empty();
    searchResultRecipesMap = {};

    recipes.forEach(function(recipe){
      var recipePanel = createRecipePanel(recipe, true);
      $("#recipes-wrapper").append(recipePanel);
    });
  }

  function createRecipePanel(recipe, showCheckBox){
    var name = recipe.name;
    var image = recipe.image;
    var link = recipe.link;
    var dataPoints = recipe.dataPoints;
    var info = recipe.kvtable;
    var id = getRecipeId(link);
    searchResultRecipesMap[id] = new Recipe(id, name, link, image, null, null, info);
    
    var recipePanel = $("<div>").addClass("panel panel-recipe").attr("id" , id);
    var recipeHeader = $("<div>").addClass("panel-heading");
    var recipeBody = $("<div>").addClass("panel-body");

    var recipeName = $("<h3>").addClass("panel-title").text(name).addClass("display-recipe");
    if(showCheckBox){
      var checkBoxSpan = $("<span>").addClass("input-group-addon");
      var inputCheckBox = $("<input>").attr({"type": "checkbox", "data-recipe-id": id});
      recipeHeader.append(inputCheckBox);
    }
    recipeHeader.append(recipeName);

    var recipeImg = $("<img>").attr("src", image).addClass("recipe-image");
    var recipeImgLink = $("<a>").attr("href", link).attr('target','_blank').append(recipeImg);
    var recipeLinkWrapper = $("<div>").append(recipeImgLink).addClass("display-recipe");
    
    var recipeInfoTable = info;
    var tableWrapper = $("<div>").addClass("display-recipe").html(info);  

    recipeBody.append(recipeLinkWrapper);
    recipeBody.append(tableWrapper);

    recipePanel.append(recipeHeader);      
    recipePanel.append(recipeBody);

    return recipePanel;
  }

  function getRecipeId(link){
    var idStartIndex = link.lastIndexOf("-") + 1;
    return link.substring(idStartIndex, link.length);
  }

  function getRecipeInfoTable(dataPoints){
    var table = $("<table>").addClass("recipe-info");
    var tbody = $("<tbody>");
    table.append(tbody);

    dataPoints.forEach(function(dataPoint){
      var row = $("<tr>");
      row.append($("<td>").text(dataPoint.key));
      row.append($("<td>").text(dataPoint.value));
      tbody.append(row);
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

  function displaySavedCollection(childSnapshot){
    var recipeCollectionName = childSnapshot.key;
      
    var recipeCollectionObj = childSnapshot.val();
    // var recipeZipcode = recipeCollectionObj.zipcode;
    // var recipeEmail = recipeCollectionObj.email;
    var recipesSaved = JSON.parse(recipeCollectionObj.recipes);
    var recipeGroceryTable = recipeCollectionObj.groceryTable;

    var panelId = recipeCollectionName.replace(/\s/g, '') + "_data";

    var collectionPanel = $("<div>").addClass("panel panel-default panel-recipe");
    var collectionHeader = $("<div>").addClass("panel-heading");
    var collectionBody = $("<div>").addClass("panel-body collapse in").attr("id", panelId);

    var row = $("<div>").addClass("row");
    var col_1 = $("<div>").addClass("col-md-12 col-lg-6");
    var col_2 = $("<div>").addClass("col-md-12 col-lg-6");
    row.append(col_1, col_2);
    collectionBody.append(row);

    var collectionName = $("<h3>").addClass("panel-title").text(recipeCollectionName).addClass("display-recipe");
    var a = $("<a>").append(collectionName).
      attr({"data-toggle": "collapse", "data-target": "#"+panelId}).addClass("accordion-toggle");
    collectionHeader.append(a);

    Object.values(recipesSaved).forEach(function(recipe){
      var recipePanel = createRecipePanel(recipe, false);
      col_1.append(recipePanel);
    });

    col_2.html(recipeGroceryTable);
    collectionPanel.append(collectionHeader, collectionBody);

    $("#recipe-collection").append(collectionPanel);
  }
  

  $("#login").on("click", function(){
    event.preventDefault();
    $("#error-msg-div").hide();
    userName = $("#nameInput").val().trim();
    // email = $("#emailInput").val().trim();
    zipcode = $("#zipInput").val().trim();

    if(userName === ""){
      showErrorMessage("Please enter a UserName!");
      return 0;
    }

    if(zipcode === ""){
      showErrorMessage("Please enter a ZipCode!");
      return 0;
    }

    if (isNaN(zipcode) || zipcode < 10000) {
      showErrorMessage("Invalid ZipCode Entry!");
      return 0;
    }

    if(userName !== ""){
      usersRef.child(userName).on('child_added', displaySavedCollection);

      $("#login-window").hide();
      $("#main-tab").show();
      $("#recipe-window").show();
      $("#recipe-collection-window").show();
    }
  });

  function showErrorMessage(message){
    $("#error-msg-div").show();
    $("#error-message").html(message);
  }

  $("#save").on("click", function(){
    var collectionName = $("#recipe-collection-name").val().trim();
  
    if(collectionName !== ""){
      var userRecord = {
        recipes: JSON.stringify(selectedRecipesMap),
        groceryTable: groceryListTable[0].outerHTML 
      }
      usersRef.child(userName).child(collectionName).update(userRecord);
    }
    setTimeout(reset, 1000); 
  });

  function reset(){
    searchResultRecipesMap = {};
    selectedRecipesMap = {};

    $("#recipe-collection-name").val('');

    $("#grocery-selected-recipes").empty();
    $("#grocery-list-wrapper").empty();
    $("#recipes-wrapper").empty();
    $("#selected-recipes-wrapper").empty();

    $("#grocery-list-window").hide();
    $("#recipe-window").show();
    $("#map-window").hide();
  }

  $('#main-tab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show');
  })

});