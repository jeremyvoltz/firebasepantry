
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

var baseURL = 'https://pantry-1722d.firebaseio.com/'
Vue.use(VueRouter)

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

Vue.component('pantry', {
  template:  '#pantry-template',
  props: ['function']
})
Vue.component('essentials', {
  template: '#essentials-template',
  props: ['click']
})
Vue.component('shopping', {})

var app = Vue.extend({

  // element to mount to
  el: '#app',

  // initial data
  data: {
    currentView: 'pantry',
    focusFood: null,
    foods: [],
    options: ["buy", "full", "sale"],
    stores: [],
    // statuses: [{text: "buy", value: "buy"}, 
    // {text:"full", value: "full"}, {text:"if on sale", value: "if on sale"}],
    newFood: {
      name: "",
      stores: {},
      essential: false,
      status: "buy",
      notes: ""
      // buy: true
    },
    newStore: {
      name: "",
      foods: []
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
      app.focusFood = food;
      
      // $('#propModal').html(modalhtml);
      $('#propModal').modal({"show":true});
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
        Stores.child(store.id+"/foods/"+food.id).set(true);
          Foods.child(food.id+"/stores/"+store.id).set(true);
    },
    goShopping: function () {
        app.currentView = 'essentials'
    }

  }

  
})
var Foo = Vue.extend({
    template: '<p>This is foo!</p>'
})

var Bar = {
    template: '<p>This is bar!</p>'
}

var App = Vue.extend({})
var router = new VueRouter()
router.map({
    '/foo': {
        component: Foo
    },
    '/bar': {
        component: Bar
    }
})
router.start(App, '#app')

}