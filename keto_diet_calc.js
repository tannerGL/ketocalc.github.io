
var HEADER__FOOD_NAME = "Food Item per 100gm serving";
var HEADER__PROTEIN = "Protein";
var HEADER__FAT = "Fat";
var HEADER__CARBS = "Carb";
var HEADER__FIBER = "Fiber";
var HEADER__CALORIES = "Calories";

function getTableElem() {
    var tableElem = $("#ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods").get()[0];

    return tableElem;
}

function showOrHideResultsRow() {
    var tableElem = getTableElem();

    var visibleRowCount = 0;

    for ( var i = 1; i < tableElem.rows.length-1; i++ ) {
        var ithRow = tableElem.rows[i];

        if ( $(ithRow).is(":visible") ) {
            visibleRowCount++;
        }
    }

    // if ( visibleRowCount == 0 ) {
    //     $(tableElem.rows[tableElem.rows.length-1]).hide();
    // } else {
    //     $(tableElem.rows[tableElem.rows.length-1]).show();
    // }
}

function addFood(csv, foodName) {

    if ( foodName ) { 

    } else {
        return;
    }
    var tableElem = getTableElem();

    var row = tableElem.insertRow(tableElem.rows.length-1);
    var ctlIndex = tableElem.rows.length-1;
    var ctlId = "ctl" + (ctlIndex >= 10 ? ctlIndex : "0"+ctlIndex);
    var newRowHtml = NEW_ROW_HTML;

    var foodRow = null;

    for ( var i = 0; i < csv.length; i++ ) {
        var ithRow = csv[i];
        var ithFoodName = ithRow[HEADER__FOOD_NAME];

        if ( foodName == ithFoodName ) {
            foodRow = ithRow;
            break;
        }
    }

    if ( foodRow == null ) {
        return;
    }

    debugger;

    newRowHtml = newRowHtml.replaceAll("${food_name}", foodName);
    newRowHtml = newRowHtml.replaceAll("${starting_grams}", "0");
    newRowHtml = newRowHtml.replaceAll("${fat}", foodRow[HEADER__FAT]);
    newRowHtml = newRowHtml.replaceAll("${protein}", foodRow[HEADER__PROTEIN]);
    newRowHtml = newRowHtml.replaceAll("${carbs}", foodRow[HEADER__CARBS]);
    newRowHtml = newRowHtml.replaceAll("${fiber}", foodRow[HEADER__FIBER]);
    newRowHtml = newRowHtml.replaceAll("ctl02", ctlId);

    row.innerHTML = newRowHtml;
    row.id = "row_" + ctlId;

    $("#ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_"+ctlId+"_ckDelete").on("click", function() {
        var gramInputElemId = "ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_txtActGrams".replace("ctl02", ctlId);
        var gramInputElem = document.getElementById(gramInputElemId);
        gramInputElem.value = 0;

        $(row).hide();

        calcfoods(gramInputElem);

        showOrHideResultsRow();
    });

    var inputElem = $("#ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_"+ctlId+"_txtActGrams").get()[0];

    showOrHideResultsRow();

    calcfoods(inputElem);
}

$( document ).ready(function() {
    console.log( "ready!" );
    $("#colSidebarContent").hide();
    $("#PanelMealHead").hide();
    $("#header").hide();
    $("#sub-header").hide();
    $("#blue-text-message").hide();
    $("#specific-directions").hide();
    $("#meal-photos").hide();
    $("#bottom-footer").hide();
    $("#action-buttons").hide();
    $("#saveChangesBottom").hide();

    $("#optimize-button").on("click", function() {
        var tableElem = getTableElem();
        var tableLength = tableElem.rows.length;
        var FoodItemsDict = {"Names": [], "Protein": [], "Fat": [], "Net Carbs": [], "kCals": []}
        for ( var i = 0; i < tableLength; ++i )
        {
            if (!tableElem.rows[i].id) continue;
            var cells = tableElem.rows[i].cells;
            FoodItemsDict["Names"].push(cells[1].textContent);
            FoodItemsDict["Protein"].push(parseFloat(cells[5].textContent));
            FoodItemsDict["Fat"].push(parseFloat(cells[4].textContent));
            FoodItemsDict["Net Carbs"].push(parseFloat(cells[6].textContent));
            FoodItemsDict["kCals"].push(parseFloat(cells[9].textContent));
        }

        fetch("https://tgerard1121.pythonanywhere.com/optimize",
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(FoodItemsDict)
        })
        .then((response) => {
            if (!response.ok)
            {
                throw new Error("Response from Optimizer API not ok.");
            }
            return response.json();
        })
        .then ((data) => {
            var dataIndex = 0;
            for (var i = 0; i < tableElem.rows.length; ++i)
            {
                if (!tableElems.rows[i].id) continue;
                var cells = tableElem.rows[i].cells;
                cells[2].childNodes[1].value = data[dataIndex++];
            }
        })
        .catch((error) => {
            console.log("POST to Optimizer API failed.");
        });
    });

    parseData("./table_cf.csv", function(csv) {

        csv.sort(function(a, b) {
            return a[HEADER__FOOD_NAME].localeCompare(b[HEADER__FOOD_NAME]);
        });

        var searchSelect = document.getElementById("txtFoodSearch2");

        // searchSelect.addEventListener("change", function() {
        //     debugger;
        //     addFood(csv, this.value)
        // });

        for ( var i = 0; i < csv.length; i++ ) {
            var ithRow = csv[i];
            var foodName = ithRow[HEADER__FOOD_NAME];

            var opt = document.createElement('option');
            opt.value = foodName;
            opt.innerHTML = foodName;
            searchSelect.appendChild(opt);
        }
        
        // $('#txtFoodSearch2').selectize({
        //     onChange: function(value) {
        //         addFood(csv, value);
        //     }
        // });

        $foodSearch = $('#txtFoodSearch2');
        $foodSearch.select2({
            allowClear: true,
            // placeholder: function(){
            //     $(this).data('placeholder');
            // }
            placeholder: "Search foods ..."
        });

        $foodSearch.on("change", function(e) {
            var foodName = this.value;
            addFood(csv, foodName);
        });
    });

    var tableElem = getTableElem();

    while (tableElem.rows.length > 2) {
        tableElem.deleteRow(1);
    }


    showOrHideResultsRow();

    // calcfoods()



    // $("#txtFoodSearch").on("click", function() {
        
    // });
});

function incrementGrams(elem, delta) {
    var baseId = elem.dataset.baseId;

    var gramInputElemId = "ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_txtActGrams".replace("ctl02", baseId);
    var gramInputElem = document.getElementById(gramInputElemId);
    gramInputElem.value = parseInt(gramInputElem.value) + delta;

    calcfoods(gramInputElem);
}

function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        header: true,
        // dynamicTyping: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}


var NEW_ROW_HTML =
' <td style="width:50px;">' +
'              <span class="ckdelete"><input id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_ckDelete" value="✖" type="button" name="ctl00$MainContent$lvActualMeals$ctrl0$gvActualFoods$ctl02$ckDelete" tabindex="-1" value="✖"></span>' +
'         </td><td>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFoodItem" style="display:inline-block;width:125px;">${food_name}</span>' +
'        </td><td class="actual-foods-grams-col" valign="top" style="width:65px;">' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblActGrams" class="Hide">${starting_grams}</span>' +
'            <input name="ctl00$MainContent$lvActualMeals$ctrl0$gvActualFoods$ctl02$txtActGrams" type="text" value="${starting_grams}" id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_txtActGrams" class="form-control txtactgrams" onchange="calcfoods(this);">' +
                    
                    
'          <span data-val-controltovalidate="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_txtActGrams" data-val-errormessage="Grams are required" data-val-display="Dynamic" id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_RequiredFieldValidator1" class="error-text" data-val="true" data-val-evaluationfunction="RequiredFieldValidatorEvaluateIsValid" data-val-initialvalue="" style="display:none;">Grams are required</span>' +
'          </td><td class="actual-foods-arrows-col" valign="top" style="width:35px;">' +
'             <div class="arrow-icons-wrap">' +
'                <input type="image" name="ctl00$MainContent$lvActualMeals$ctrl0$gvActualFoods$ctl02$IBtnUp" id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_IBtnUp" tabindex="-1" class="arrow-icons arrow-icon-up" src="./keto_diet_calculator_files/icon-arrow-up.png" data-base-id="ctl02" onclick="javascript:incrementGrams(this, 1);">' +
'                <input type="image" name="ctl00$MainContent$lvActualMeals$ctrl0$gvActualFoods$ctl02$IBtnDown" id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_IBtnDown" tabindex="-1" class="arrow-icons arrow-icon-down" src="./keto_diet_calculator_files/icon-arrow-down.png" data-base-id="ctl02" onclick="javascript:incrementGrams(this, -1);">' +
'             </div> <!-- //.arrow-icons-wrap -->' +
'         </td><td align="left" style="width:60px;">' +
'             <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblCalcFat">0</span>' +
'             <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblOldFat" class="Hide">0</span>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFoodFat" class="Hide">${fat}</span>' +
'         </td><td align="left" style="width:60px;">' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblCalcPro">0</span>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblOldPro" class="Hide">0</span>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFoodPro" class="Hide">${protein}</span>' +
'        </td><td align="left" style="width:60px;">' +
'           <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblCalcCarb">0</span>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblOldCarb" class="Hide">0</span>' +
'           <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFoodCarb" class="Hide">${carbs}</span>' +
'       </td><td align="right">' +
'           <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFiberUnknown" class="Hide" style="color:Blue;">*</span>' +
'            <span class="Hide"><input id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_ckFiberUnknown" type="checkbox" name="ctl00$MainContent$lvActualMeals$ctrl0$gvActualFoods$ctl02$ckFiberUnknown"></span>' +
'        </td><td align="left" style="width:55px;">' +
'             <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblCalcFiber">0</span>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblOldFiber" class="Hide">0</span>' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFiber" class="Hide">${fiber}</span>' +
'        </td><td align="left" style="width:55px;">' +
'            <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblCalcCal">0</span>' +
'          <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblOldCal" class="Hide">0</span>' +
'           <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblIVCarb" class="Hide">0</span>' +
'       </td><td class="actual-foods-pro-carb-col" style="border-style:None;width:55px;">' +
'          &nbsp;' +
'      </td><td class="actual-foods-ratio-col" style="border-style:None;width:50px;">' +
'           <span id="ctl00_MainContent_lvActualMeals_ctrl0_gvActualFoods_ctl02_LblFoodID" class="Hide">457</span>' +
'         </td>';