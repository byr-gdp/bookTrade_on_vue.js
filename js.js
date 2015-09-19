// var baseURL = 'https://vue-demo.firebaseIO.com/'
var baseURL = 'https://booktrade.firebaseio.com'
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var telRE = /^1[3|4|5|7|8][0-9]\d{4,8}$/
var qqRE = /^[1-9][0-9]{4,9}$/
/**
 * Setup firebase sync
 */

// var Users = new Firebase(baseURL + 'users')
var Books = new Firebase(baseURL + '/books');

Books.on('child_added', function (snapshot) {
  // var item = snapshot.val()
  // item.id = snapshot.name()
  // app.users.push(item)
  var book = snapshot.val();
  app.books.push(book);
})

Books.on('child_removed', function (snapshot) {
  var id = snapshot.name()
  // app.users.some(function (user) {
  //   if (user.id === id) {
  //     app.users.$remove(user)
  //     return true
  //   }
  // })
})

/**
 * Create Vue app
 */
  
//载入网页当前时间 用于计算图书已发布时间
var currentTime = Date.parse(new Date());

var app = new Vue({

  // element to mount to
  el: '#app',

  // initial data
  data: {
    books: [],
    searchKey:'',
    sortKey:'time',
    //载入网页当前时间 用于计算图书已发布时间
    current: currentTime,
    newBook: {
        name: '',
        desc: '',
        price: '',
        seller: '',
        tel:'',
        qq: '',
        academy:'',
        // id:'',
        // 增加上传时间字段time 单位ms 用于排序
        time:'',
        //上传时间字段 字符串 用于显示发布时间
        releasetime:''
    },
    validation: {
      name: false,
      desc: false,
      price: false,
      seller: false,
      tel: false,
      qq: false,
      academy: false
    },
    //the value of validation
    checkSuccess: false,
    checkFailed: false
  },

  // validation filters are "write only" filters
  filters: {
    nameValidator: {
      write: function (val) {
        this.validation.name = !!val
        return val
      }
    },
    descValidator: {
      write: function(val) {
        this.validation.desc = !!val;
        return val;
      }
    },
    priceValidator: {
      // 前台判断或许更好
      write: function(val) {
        this.validation.price = (val >= 0) ? true : false;
        return val;
      }
    },
    sellerValidator: {
      write: function(val) {
        this.validation.seller = !!val
        return val;
      }
    },
    telValidator: {
      write: function(val) {
        //判断电话号码正则表达
        this.validation.tel = telRE.test(val);
        return val;
      }
    },
    qqValidator: {
      write: function(val) {
        //判断qq正则表达 同电话
        this.validation.qq = qqRE.test(val);
        return val;
      }
    },
    academyValidator: {
      write: function(val) {
        this.validation.academy = !!val;
        return val;
      }
    }
    // emailValidator: {
    //   write: function (val) {
    //     this.validation.email = emailRE.test(val)
    //     return val
    //   }
    // }
  },

  // computed property for form validation state
  computed: {
    isValid: function () {
      var valid = true
      for (var key in this.validation) {
        if (!this.validation[key]) {
          console.log('key = ' + key);
          valid = false
        }
      }
      this.checkSuccess = valid;
      this.checkFailed = !valid;
      return valid;
    }
  },
  events: {
    create: function() {
      console.log('create');
    },
    init: function() {
      console.log('init');
    },
    ready: function() {
      console.log('ready');
    }
  },
  
  // methods
  methods: {
    // addUser: function (e) {
    //   e.preventDefault()
    //   if (this.isValid) {
    //     Users.push(this.newUser)
    //     this.newUser = {
    //       name: '',
    //       email: ''
    //     }
    //   }
    // },
    addBook: function(e) {
      e.preventDefault();
      console.log('isValid :' + this.isValid)
      if(this.isValid){
        var date = new Date();
        // this.newBook.time = date;
        // console.log('id:' + this.newBook.id);
        // this.newBook.id = this.books.length;

        //更新当前时间，避免出现 发布分钟时间为负数 的问题
        this.current = Date.parse(date);
        console.log('current :' + this.current);
        //修改原发布时间显示格式： **分钟前
        //用于排序
        this.newBook.time = Date.parse(date);

        //更新后得发布时间系那是格式： *年*月*日 时分秒
        // this.newBook.releasetime = JSON.stringify(date);
        this.newBook.releasetime = date.toLocaleString();

        console.log('time :' + this.newBook.time);
        console.log('releaseTime :' + this.newBook.releasetime);
        // console.log('after time: ' + this.newBook.id);
        Books.push(this.newBook);
        $('')
        console.log('this.newBook = ' + JSON.stringify(this.newBook));
        this.newBook = {
          name:'',
          desc:'',
          price:'',
          seller:'',
          tel:'',
          qq:'',
          academy:'',
          time:'',
          releasetime:'',
        }
        this.checkSuccess = true;
        this.checkFailed = false;
      }
      else{
        console.log('something wrong');
        this.checkFailed = true;
        this.checkSuccess  = false;
      }
    },
    removeUser: function (user) {
      // new Firebase(baseURL + 'users/' + user.id).remove()
    }
  }
})