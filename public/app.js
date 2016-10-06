
// Users.on('child_removed', function (snapshot) {
//   var id = snapshot.key()
//   app.users.some(function (user) {
//     if (user.id === id) {
//       app.users.$remove(user)
//       return true
//     }
//   })
// })

// /**
//  * Create Vue app
//  */
window.onload = function () {
  $(".shop").hide();


var baseURL = 'https://pantry-1722d.firebaseio.com/'

/**
 * Setup firebase sync
 */

var rootRef = firebase.database().ref();
var Foods = rootRef.child("foods");
var Stores = rootRef.child("stores");

Foods.on('child_added', function (snapshot) {
  var item = snapshot.val()
  item.id = snapshot.key
  app.foods.push(item)
});

Stores.on('child_added', function (snapshot) {
  var item = snapshot.val()
  item.id = snapshot.key
  app.stores.push(item)
});

Foods.on('child_removed', function (snapshot) {
  var id = snapshot.key
  app.foods.some(function (food) {
    if (food.id === id) {
      app.foods.$remove(food)
      return true;
    }
  })
});

Stores.on('child_removed', function (snapshot) {
  var id = snapshot.key
  app.stores.some(function (store) {
    if (store.id === id) {
      app.stores.$remove(store)
      return true;
    }
  })
});


var app = new Vue({

  // element to mount to
  el: '#app',

  // initial data
  data: {
    currentView: 'pantry',
    foods: [],
    shoppingList: [],
    options: ["buy", "full", "sale"],
    stores: [],
    focusStoreId: 0,
    focusStoreName: "--",
    // statuses: [{text: "buy", value: "buy"}, 
    // {text:"full", value: "full"}, {text:"if on sale", value: "if on sale"}],
    newFood: {
      name: "",
      stores: {0:0},
      essential: false,
      status: "buy",
      notes: "",
      purchased: false
      // buy: true
    },
    newStore: {
      name: "",
      foods: []
    }
  },
  computed: {
    filteredfoods: function () {
      return this.foods.filter(function (food) {
        return food.stores.indexOf(app.focusStoreId) > -1;
      })
    }
  },

  watch: {
    select: function (value) {
      alert("works")
    }
  },


  // // computed property for form validation state
  // computed: {
  //   validation: function () {
  //     return {
  //       name: !!this.newFood.name.trim(),
  //       email: emailRE.test(this.newUser.email)
  //     }
  //   },
  //   isValid: function () {
  //     var validation = this.validation
  //     return Object.keys(validation).every(function (key) {
  //       return validation[key]
  //     })
  //   }
  // },

  // methods
  methods: {
    addFood: function () {
      // if (this.isValid) {
        Foods.push(this.newFood)
        this.newFood.name = ''
        // this.newFood.email = ''
      // }
    },
    removeFood: function (food) {
      Foods.child(food.id).remove()
    },
    updateEssential: function (food) {
      
        Foods.child(food.id).update({"essential":food.essential});
      
    },
    updateStatus: function (food) {
      Foods.child(food.id).update({"status":food.status});
    },
    properties: function (food) {
      // app.focusFood = food;
      
      // $('#propModal').html(modalhtml);
      $("#"+food.id+'_propertiesModal').modal({"show":true});
    },

    storeModal: function () {      
      // $('#propModal').html(modalhtml);
      $('#storeModal').modal({"show":true});
    },
    addStore: function () {
      // if (this.isValid) {
        Stores.push(this.newStore)
        this.newStore.name = ''
        // this.newFood.email = ''
      // }
    },
    removeStore: function (store) {
      Stores.child(store.id).remove()
    },

    updateStore: function (food, store) {
      // var path = "store/"+store.id;
      // var update = {path:food.store[store]};
       // stores.foods[food.id] = food.stores[store.id];
        // Stores.child(store.id+"/foods/"+food.id).set(food.stores[store.id]);
        Foods.child(food.id+"/stores/").set(food.stores);

    },
    goShopping: function () {
        $(".pantry").hide();
        $(".shop").show();
        $(".full").hide(); //food status
        $(".sale").append("<td class='sale-bubble'>(if on sale)</td>")

    },
    purchase: function (food) {
      Foods.child(food.id).update({"purchased":food.purchased});
      if (food.purchased) {
        $("#"+food.id+"_row").css("text-decoration","line-through")
        $("#"+food.id+"_row").css("color","gray")
      }
      else {
        $("#"+food.id+"_row").css("text-decoration","")
        $("#"+food.id+"_row").css("color","")
      }
    },
    doneShopping: function () {

      for (var i = 0; i < app.foods.length; i++) {

        var food = app.foods[i];
        $("#"+food.id+"_row").css("text-decoration","")
        $("#"+food.id+"_row").css("color","")

        if (food.purchased) {
          food.purchased = false;
          Foods.child(food.id).update({"purchased":false});
          food.status = "full";
          Foods.child(food.id).update({"status": "full"});
        }
      }
      $(".pantry").show();
        $(".shop").hide();
      $(".full").show(); //food status
      $(".sale-bubble").remove();
      app.focusStoreId = 0;
      app.focusStoreName = "--"
    },
    changeStore: function () {
      if (app.focusStoreName == '--') {
        app.focusStoreId = 0;
      }
      else{
        for (var i = 0; i < app.stores.length; i++) {
          if (app.stores[i].name == app.focusStoreName) {
            app.focusStoreId = app.stores[i].id;
          }
        }
      }

      app.goShopping();
    }

  }

  
})

}