let price = 19.5;
let cid = [
  ['PENNY', 0.5],
  ['NICKEL', 0],
  ['DIME', 0],
  ['QUARTER', 0],
  ['ONE', 0],
  ['FIVE', 0],
  ['TEN', 0],
  ['TWENTY', 0],
  ['ONE HUNDRED', 0]
];

const denominations = {
  "PENNY": .01,
  "NICKEL": .05,
  "DIME": .1,
  "QUARTER": .25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

function calcDenominations (cid) {
  const remappedDenom = {};
  for (const denom of cid) {
    remappedDenom[denom[0]] = Math.round(denom[1]/denominations[denom[0]]);
  }
  return remappedDenom;
}

function output (str) {
  document.getElementById("change-due").innerHTML = str;
  return str;
}

function outputDenominationsObject(obj) {
  let outputString = `STATUS: ${obj.Status}`;
  if (["OPEN","CLOSED"].indexOf(obj.Status) >= 0) {
    for (const denom of Object.keys(obj.Denominations)) {
      outputString += `<br />${denom}: $${obj.Denominations[denom]*denominations[denom]}`
    }
  }
  return output(outputString);
}

function makeChange(cid,changeNeeded) {
  const cidDenominations = calcDenominations(cid);
  // console.log(cidDenominations);
  let changeRemaining = changeNeeded;
  const changeNotes = {};
  // console.log(`Initial Change: ${changeRemaining}`);
  for (const denom of Object.keys(denominations).reverse()) {
    // console.log(denom);
    // loop through denominations and payout while still positive
    for (let qty=cidDenominations[denom];qty>0;qty--) {
      // console.log(`${denom} > ${qty}`);
      // console.log(`Processing ${denom}, qty in drawer ${qty} ...`);
      const newChangeRemaining = Math.round((changeRemaining - denominations[denom])*100)/100;
      // console.log(`newChangeRemaining ${newChangeRemaining}`);
      if (newChangeRemaining>=0) {
        changeRemaining = Math.round((changeRemaining-denominations[denom])*100)/100;
        // console.log(`Add one ${denom} to change, change remaining: ${changeRemaining}`)
        if (changeNotes.hasOwnProperty(denom)) {
          changeNotes[denom] += 1;
        } else {
          changeNotes[denom] = 1;
        }
      } else {
        break;
      }
    }
    // console.log(`Processed, ChangeRemaining: ${changeRemaining}`);
    // quit if change renaming is zero
    if (changeRemaining==0) {
      break;
    }
  }

  const cidTotalCash = cid.map(d=>d[1]).reduce((s, n) => s + n, 0);
  if (changeRemaining>0) {
    console.log(`Unable to make change`)
    return {Status:"INSUFFICIENT_FUNDS",Denominations:null};
  } else if (cidTotalCash==changeNeeded) {
    // total cid, if total(cid) = change needed
    return {Status:"CLOSED",Denominations:changeNotes};
  } else {
    return {Status:"OPEN",Denominations:changeNotes};
  }
}

function getChange (price,cid,payment) {
  // req 4
  if (price>payment) {
    alert("Customer does not have enough money to purchase the item")
  } else if (price==payment) { // req 5
    return output("No change due - customer paid with exact cash");
  } else {
    // change
    const change = Math.round((payment-price)*100)/100;
    console.log(`Price: ${price}. Payment: ${payment}. Change due: ${change}`);
    // denom in drawer
    // console.log(calcDenominations(cid));
    const changeDenom = makeChange(cid,change);
    console.log(changeDenom);
    outputDenominationsObject(changeDenom);
    // convert to total $'s per denomination
  }
}

// add listeners
document.getElementById("purchase-btn").addEventListener('click', ()=>{
  getChange(price,cid,document.getElementById("cash").value)
})