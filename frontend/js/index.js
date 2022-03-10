console.log("frontend script linked");
console.log(sessionStorage);

const addProductForm = document.getElementById('addProductForm');
const updateProductForm = document.getElementById('updateProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const logo = document.getElementById('logo');
const results = document.getElementById('result');
const landing = document.getElementById('landing');

$('#addProductNav').click(function() {
    addProductForm.style.display = ("block");
    updateProductForm.style.display = ("none");
    deleteProductForm.style.display = ("none");
    landing.style.display = ("none");
    results.style.display = ("none");
});

$('#updateProductNav').click(function() {
    updateProductForm.style.display = ("block");
    addProductForm.style.display = ("none");
    deleteProductForm.style.display = ("none");
    landing.style.display = ("none");
    results.style.display = ("none");
});

$('#deleteProductNav').click(function() {
    deleteProductForm.style.display = ("block");
    addProductForm.style.display = ("none");
    updateProductForm.style.display = ("none");
    landing.style.display = ("none");
    results.style.display = ("none");
});

$('#logo').click(function() {
    addProductForm.style.display = ("none");
    updateProductForm.style.display = ("none");
    deleteProductForm.style.display = ("none");
    landing.style.display = ("flex");
    results.style.display = ("flex");
});

$(document).ready(function() {
    console.log("ready")

    let url;

    $.ajax({
        url: 'config.json',
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function(configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            console.log(url);
        },
        error:function(error) {
            console.log(error)
        }
    })

    // view products from BD
    $("#viewProducts").click(function() {
        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            dataType: 'json',
            success: function(productsFromMongo) {
                document.getElementById('result').innerHTML = "";
                for(let i = 0; i < productsFromMongo.length; i++) {
                    document.getElementById('result').innerHTML +=
                    `
                        <div class="card" style="width: 19rem;">
                            <img class="card__img" src=${productsFromMongo[i].image_url} alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card__heading">${productsFromMongo[i].name}</h5>
                                <p class="card__p">$${productsFromMongo[i].price}</p>
                            </div>
                        </div>
                    `
                }
            }, // success
            error: function() {
                alert('unable to get products');
            }
        }) // ajax
    }) // end of view products from db

    $('#addProduct').click(function() {
        event.preventDefault();

        let name = $('#nameInput').val();
        let price = $('#priceInput').val();
        let imgUrl = $('#ImgUrlInput').val();

        console.log(name, price, imgUrl);

        if(name == "" || price == "" || imgUrl == "") {
            alert('please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/addProduct`,
                type: 'POST',
                data: {
                    name: name,
                    price: price,
                    img_url: imgUrl
                },
                success: function(product) {
                    console.log(product);
                    alert('product added');
                },
                error: function() {
                    console.log('error: cannot call api');
                }
            })
        }
    }) // add product

    $('#updateProduct').click(function() {
        event.preventDefault();

        let id = $('#productIdInput').val();
        let updateName = $('#nameUpdateInput').val();
        let updatePrice = $('#priceUpdateInput').val();
        let updateImgUrl = $('#ImgUrlUpdateInput').val();

        console.log(id, updateName, updatePrice, updateImgUrl);

        if(id == "") {
            alert("please enter product ID")
        } else {
            $.ajax({
                url: `http://${url}/updateProduct/${id}`,
                type: 'PATCH',
                data:{
                    name: updateName,
                    price: updatePrice,
                    img_url: updateImgUrl
                },
                success: function(data) {
                    console.log(data);
                },
                error: function() {
                    console.log('error: cannot update');
                }
            })
        }
    }) // update product

    $('#deleteProduct').click(function() {
        event.preventDefault();

        let id = $('#deleteProductIdInput').val();
        console.log(id);

        if(id == "") {
            alert('please enter product ID');
        } else {
            $.ajax({
                url: `http://${url}/deleteProduct/${id}`,
                type: 'DELETE',
                success: function(data) {
                    console.log('deleted');
                    alert("deleted");
                },
                error: function() {
                    console.log('error: cannot delete');
                }
            })
        }
    }) // deleted product

    //Register User
$('#signUp').click(function(){
    event.preventDefault();
    let username = $('#usernameInput').val();
    let email = $('#emailInput').val();
    let password = $('#passwordInput').val();
    console.log(username, email, password);
    if (username == '' || email == '' || password == ''){
      alert('Please enter all details');
    } else {
      $.ajax({
        url: `http://${url}/registerUser`,
        type: 'POST',
        data : {
          username : username,
          email : email,
          password : password
        },
        success:function(user){
          console.log(user);//remove log when dev is finished
          if(!user == 'username taken already. Please try another name'){
            alert('Please login to edit products');
          } else {
            alert('username take already. Please try another name');
            $('#r-username').val('');
            $('#r-email').val('');
            $('#r-password').val();
          } //else
        }, //success
        error:function(){
          console.log('error: cannot call api');
        }
      }) // ajax
    }//else
  })//end of click function
  //end of register user

}) // document ready