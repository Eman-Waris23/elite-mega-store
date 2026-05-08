// ====== CATALOG & IMAGES ======
const categories = ["Electronics","Beauty & Health","Clothing & Fashion","Home & Kitchen","Sports & Fitness"];
const itemsPerCategory = 30;
const catalog = {};

// ====== FOLDER PATH ======
const imageFolder = "Project"; // <-- yahan aapka folder ka naam jo images contain karta ho

categories.forEach(cat => {
  catalog[cat] = [];
  for(let i=1; i<=itemsPerCategory; i++){
    let prodName="";
    if(cat==="Electronics") prodName = i%3===0 ? "Laptop" : i%3===1 ? "Mobile" : "Headphones";
    else if(cat==="Beauty & Health") prodName = i%3===0 ? "Makeup" : i%3===1 ? "Skincare" : "Perfume";
    else if(cat==="Clothing & Fashion") prodName = i%3===0 ? "TShirt" : i%3===1 ? "Jeans" : "Shoes";
    else if(cat==="Home & Kitchen") prodName = i%3===0 ? "Cookware" : i%3===1 ? "Furniture" : "Decor";
    else if(cat==="Sports & Fitness") prodName = i%3===0 ? "Dumbbells" : i%3===1 ? "YogaMat" : "Shoes";

    // ====== IMAGE PATH ======
    const imgFile = `${imageFolder}/${prodName}_${i}.jpg`;

    catalog[cat].push({
      id: `${cat.replace(/\s+/g,'')}_${i}`,
      name: `${prodName} ${i}`,
      price: Math.floor(100 + Math.random() * 900),
      img: imgFile
    });
  }
});

let CART=[], SALES=[], LOGGED_IN_USER=null;

// ====== HELPER ======
function hideAllContent(){
  document.getElementById("contentArea").innerHTML="";
  document.getElementById("successBox").style.display="none";
}

// ====== LOGIN / LOGOUT ======
function doLogin(){
  const user=document.getElementById("username").value.trim();
  const pass=document.getElementById("password").value.trim();
  if(user==="admin" && pass==="1234"){
    LOGGED_IN_USER=user;
    document.getElementById("loginPage").style.display="none";
    document.getElementById("app").style.display="block";
    showProducts();
  } else {
    alert("Incorrect credentials — use admin / 1234");
  }
}
function doLogout(){
  LOGGED_IN_USER=null;
  CART=[];
  SALES=[];
  location.reload();
}

// ====== SHOW PRODUCTS ======
function showProducts(){
  hideAllContent();
  let html=`<div class="cat-row">
    <select id="catSelect" class="cat-select" onchange="renderCategory()">
      <option value="">All</option>
      ${categories.map(c=>`<option value="${c}">${c}</option>`).join('')}
    </select>
  </div>
  <div id="gridArea" class="grid"></div>`;
  document.getElementById("contentArea").innerHTML=html;
  renderCategory();
}

// ====== RENDER CATEGORY ======
function renderCategory(){
  const sel=document.getElementById("catSelect");
  const cat=sel.value;
  const grid=document.getElementById("gridArea");
  let items=[];
  if(!cat){
    categories.forEach(c => items=items.concat(catalog[c]));
  } else {
    items=catalog[cat];
  }
  let out="";
  items.forEach(it => {
    out+=`<div class="card" id="${it.id}">
      <img src="${it.img}" alt="${it.name}" />
      <h3>${it.name}</h3>
      <p>PKR ${it.price}</p>
      <button class="add-btn" onclick="silentAddToCart('${it.id}')">Add to Cart</button>
    </div>`;
  });
  grid.innerHTML=out;
}

// ====== CART ======
function silentAddToCart(itemId){
  let found=null;
  outer: for(let cat of categories){
    for(let it of catalog[cat]){
      if(it.id===itemId){found=it; break outer;}
    }
  }
  if(found){
    CART.push({...found});
    const card=document.querySelector(`#${itemId}`);
    if(card){
      card.style.border="2px solid #ffd700";
      card.style.transform="scale(1.03)";
      setTimeout(()=>{
        card.style.border="";
        card.style.transform="";
      },800);
    }
  }
}

function showCart(){
  hideAllContent();
  const total=CART.reduce((s,i)=>s+Number(i.price||0),0);
  let html=`<div class="panel"><h2>Shopping Cart</h2>
    <table class="table">
      <thead><tr><th>Item</th><th>Price (PKR)</th></tr></thead>
      <tbody>
        ${CART.map(ci=>`<tr><td>${ci.name}</td><td>${ci.price}</td></tr>`).join('') || `<tr><td colspan="2">Cart is empty</td></tr>`}
      </tbody>
    </table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap">
      <div style="font-weight:800">Total: PKR ${total}</div>
      <div>
        <button class="small back" onclick="showProducts()">Back</button>
        <button class="small cancel" onclick="cancelCart()">Cancel</button>
        <button class="action-btn" onclick="showCheckout()">Checkout</button>
      </div>
    </div>
  </div>`;
  document.getElementById("contentArea").innerHTML=html;
}

function cancelCart(){CART=[]; showCart();}

// ====== CHECKOUT ======
function showCheckout(){
  hideAllContent();
  const total=CART.reduce((s,i)=>s+Number(i.price||0),0);
  let html=`<div class="checkout-panel">
    <h2>Checkout</h2>
    <p style="font-weight:700;margin-bottom:10px;">Total: PKR ${total}</p>
    <label style="font-weight:700">Select Payment Method</label>
    <div class="pay-row">
      <select id="paymentMethod" class="input-field" onchange="paymentMethodChanged()">
        <option value="card">Credit / Debit Card</option>
        <option value="cod">Cash on Delivery (COD)</option>
        <option value="mobile">Mobile / Bank Transfer</option>
      </select>
    </div>
    <div id="paymentFields" style="margin-top:12px"></div>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <button class="small back" onclick="showCart()">Back</button>
      <button class="pay-btn" onclick="placeOrder()">Pay & Place Order</button>
    </div>
  </div>`;
  document.getElementById("contentArea").innerHTML=html;
  paymentMethodChanged();
}

function paymentMethodChanged(){
  const method=document.getElementById("paymentMethod").value;
  const pf=document.getElementById("paymentFields");
  if(method==="card"){
    pf.innerHTML=`<div style="display:flex;gap:10px;flex-wrap:wrap">
      <input id="cardName" class="input-field" placeholder="Card Holder Name">
      <input id="cardNumber" class="input-field" placeholder="Card Number">
      <input id="cardExp" class="input-field" placeholder="MM/YY">
      <input id="cardCvv" class="input-field" placeholder="CVV">
    </div>`;
  } else if(method==="cod"){
    pf.innerHTML=`<div>Cash on Delivery selected. No additional info required.</div>`;
  } else if(method==="mobile"){
    pf.innerHTML=`<div style="display:flex;gap:10px;flex-wrap:wrap">
      <input id="mobileNumber" class="input-field" placeholder="Mobile / Bank Account Number">
    </div>`;
  }
}

// ====== PLACE ORDER ======
function placeOrder(){
  if(CART.length===0) return alert("Cart is empty!");
  const method=document.getElementById("paymentMethod").value;
  let paymentInfo={};
  if(method==="card"){
    paymentInfo={
      name:document.getElementById("cardName").value,
      number:document.getElementById("cardNumber").value,
      exp:document.getElementById("cardExp").value,
      cvv:document.getElementById("cardCvv").value
    };
  } else if(method==="cod"){
    paymentInfo={method:"Cash on Delivery"};
  } else if(method==="mobile"){
    paymentInfo={mobile:document.getElementById("mobileNumber").value};
  }

  SALES.push({buyer:LOGGED_IN_USER, items:[...CART], payment:paymentInfo});
  CART=[];
  document.getElementById("successBox").style.display="block";
  setTimeout(()=>{
    document.getElementById("successBox").style.display="none";
    showProducts();
  },2000);
}

// ====== ADMIN ======
function showAdmin(){
  hideAllContent();
  let html=`<div class="panel">
    <h2>Admin Panel</h2>
    <p>Currently you can view categories and products count.</p>
    <ul>${categories.map(c=>`<li>${c}: ${catalog[c].length} products</li>`).join('')}</ul>
  </div>`;
  document.getElementById("contentArea").innerHTML=html;
}

// ====== SALES ======
function showSales(){
  hideAllContent();
  let html=`<div class="panel"><h2>Sales Records</h2>
    ${SALES.length===0 ? "<p>No sales yet</p>" : SALES.map(sale => `
      <div style="margin-bottom:12px;padding:10px;background:rgba(255,255,255,0.03);border-radius:10px">
        <strong>Buyer:</strong> ${sale.buyer}<br/>
        <strong>Items:</strong>
        <ul>${sale.items.map(it=>`<li>${it.name} - PKR ${it.price}</li>`).join('')}</ul>
        <strong>Payment:</strong> ${sale.payment.method || sale.payment.number || sale.payment.mobile || 'COD'}
      </div>
    `).join('')}
  </div>`;
  document.getElementById("contentArea").innerHTML=html;
}
