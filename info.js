let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create";
let tmp;
//get total
function getTotal() {
    let priceValue = parseFloat(price.value) || 0;
    let taxesValue = parseFloat(taxes.value) || 0;
    let adsValue = parseFloat(ads.value) || 0;
    let discountValue = parseFloat(discount.value) || 0;

    if (priceValue > 0) {
        let result = (priceValue + taxesValue + adsValue) - discountValue;
        total.innerHTML = result.toFixed(2);
        total.style.color = "green";
    } else {
        total.innerHTML = "0.00";
        total.style.color = "red";
    }
}

// create product

let dataProduct = localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];

submit.onclick = function () {

    if (title.value.trim() === "" || price.value.trim() === ""|| category.value.trim() === "") {
        alert("Please enter all values.");
        return;
    }

    let newProduct = {
        title: title.value.toLowerCase().trim(),
        price: parseFloat(price.value) || 0,
        taxes: parseFloat(taxes.value) || 0,
        ads: parseFloat(ads.value) || 0,
        discount: parseFloat(discount.value) || 0,
        total: parseFloat(total.innerHTML) || 0,
        count: parseInt(count.value),
        category: category.value.toLowerCase().trim(),
    };

    if(mood === "create"){
        if((newProduct.count > 100)){
            alert("Sorry, you cannot add more than 100 products.");
        }else{
            if(newProduct.count > 1){
                for(let i = 0 ; i < newProduct.count ; i++){
                    dataProduct.push(newProduct);
                }
                clearData();
            }else{
                dataProduct.push(newProduct);
                clearData();
            }
        }

    }else{
        dataProduct[tmp] = newProduct;
        mood = "create";
        submit.innerHTML = "Create Product";
        count.disabled = false;
        count.style.setProperty("background-color", "rgb(255, 255, 255)", "important");
        clearData();
    }
    

    localStorage.setItem('product', JSON.stringify(dataProduct));
    showData();

};

function clearData(){
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "0.00";
    count.value = "";
    category.value = "";
}

function showData() {
    let table = '';
    
    if (dataProduct.length === 0) {
        table = `<tr><td colspan="10" class="text-center">No products found</td></tr>`;
    } else {
        for (let i = 0; i < dataProduct.length; i++) {
            table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataProduct[i].title}</td>
                    <td>${dataProduct[i].price}</td>
                    <td>${dataProduct[i].taxes}</td>
                    <td>${dataProduct[i].ads}</td>
                    <td>${dataProduct[i].discount}</td>
                    <td>${dataProduct[i].total}</td>
                    <td>${dataProduct[i].category}</td>
                    <td><button type="button" onclick="updateProduct(${i})" class="btn btn-outline-primary" onclick="updateProduct(${i})">Update</button></td>
                    <td><button type="button" onclick="deleteData(${i})" class="btn btn-outline-danger" onclick="deleteProduct(${i})">Delete</button></td>
                </tr>
            `;
        }
    }

    document.getElementById("tbody").innerHTML = table;
    let btn = document.getElementById("deleteAll");
    if(dataProduct.length > 0){
        btn.innerHTML = `
            <button onclick = "deleteAll()" class="btn btn-danger w-100" type="button">Dlete All Product ${dataProduct.length} </button>
        `
    }else{
        btn.innerHTML = "";
    }
    
}
showData();

//  /////////////////////////////////////////////////////////////////////////////
// Delete By (Index)
function deleteData(index) {
    let productTitle = dataProduct[index]?.title || "this product";
    let del = confirm(`Do you really want to delete "${productTitle}"?`);

    if (del) {
        dataProduct.splice(index, 1);

        if (dataProduct.length > 0) {
            localStorage.setItem("product", JSON.stringify(dataProduct));
        } else {
            localStorage.removeItem("product");
        }

        showData();
    }
}

//  /////////////////////////////////////////////////////////////////////////////
//DeleteAll
function deleteAll() {

    let confirmDelete = confirm("Are you sure you want to delete all products? This action cannot be undone!");
    if (confirmDelete) {
        localStorage.clear();
        dataProduct = [];
        showData();
    }
}

//  /////////////////////////////////////////////////////////////////////////////
//Update
function updateProduct(index){
    title.value = dataProduct[index].title;
    price.value = dataProduct[index].price;
    taxes.value = dataProduct[index].taxes;
    ads.value = dataProduct[index].ads;
    discount.value = dataProduct[index].discount;
    getTotal();
    count.disabled = true;
    count.style.setProperty("background-color", "rgba(182, 182, 182, 0.86)", "important");
    category.value = dataProduct[index].category;
    submit.innerHTML = "Update";
    mood = "update";
    tmp = index;
    scroll({
        top:0
    })
}

//  /////////////////////////////////////////////////////////////////////////////
//Search
let SearchMood = "title";
function getSearchMood(id){

    let search = document.getElementById("search");

    if(id === "searchTitle"){
        SearchMood = "title";
    }else{
        SearchMood = "category";
    }
    search.placeholder = "Search By " + SearchMood;
    search.focus();
    search.value ='';
    showData();
}

function searchData(value){
    let table = '';
    for(let i = 0 ; i < dataProduct.length ; i++){
        
    if(SearchMood == 'title'){
            if(dataProduct[i].title.includes(value.toLowerCase())){
                table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataProduct[i].title}</td>
                    <td>${dataProduct[i].price}</td>
                    <td>${dataProduct[i].taxes}</td>
                    <td>${dataProduct[i].ads}</td>
                    <td>${dataProduct[i].discount}</td>
                    <td>${dataProduct[i].total}</td>
                    <td>${dataProduct[i].category}</td>
                    <td><button type="button" onclick="updateProduct(${i})" class="btn btn-outline-primary" onclick="updateProduct(${i})">Update</button></td>
                    <td><button type="button" onclick="deleteData(${i})" class="btn btn-outline-danger" onclick="deleteProduct(${i})">Delete</button></td>
                </tr>
            `;
            }
    }
    else{
            if(dataProduct[i].category.includes(value.toLowerCase())){
                table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataProduct[i].title}</td>
                    <td>${dataProduct[i].price}</td>
                    <td>${dataProduct[i].taxes}</td>
                    <td>${dataProduct[i].ads}</td>
                    <td>${dataProduct[i].discount}</td>
                    <td>${dataProduct[i].total}</td>
                    <td>${dataProduct[i].category}</td>
                    <td><button type="button" onclick="updateProduct(${i})" class="btn btn-outline-primary" onclick="updateProduct(${i})">Update</button></td>
                    <td><button type="button" onclick="deleteData(${i})" class="btn btn-outline-danger" onclick="deleteProduct(${i})">Delete</button></td>
                </tr>
            `;
        }
    }
}
    document.getElementById("tbody").innerHTML = table;
}
