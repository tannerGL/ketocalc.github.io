
function calcfoods(obj) {
    //alert('running calcmeal.js');
    //get id name of calling control
    var objname = obj.id;
    //get location of last underscore
    var idx = objname.lastIndexOf("_");
    //get string up to the underscore
    var svalue = objname.substring(0, idx);
    svalue = svalue.substring(0, idx);

    var sgrams = svalue + '_txtActGrams';

    var vgrams = parseFloat(document.getElementById(sgrams).value);

    //new fat calculation
    var scalc = svalue + '_LblFoodFat';
    var vcalc = parseFloat(document.getElementById(scalc).innerHTML) / 100;
    var vfat = round2(vcalc * vgrams);
    var sfat = svalue + '_LblCalcFat';
    document.getElementById(sfat).innerHTML = vfat;

    //grab old fat value
    var sold = svalue + '_LblOldFat';
    var oldamt = parseFloat(document.getElementById(sold).innerHTML);
    //new total fat is old total fat - old fat + new fat
    var newtot = round2(parseFloat(document.getElementById('LblTotalFat').innerHTML) - oldamt + vfat);
    document.getElementById('LblTotalFat').innerHTML = newtot;
    document.getElementById(sold).innerHTML = vfat;

    //new protein calculation
    scalc = svalue + '_LblFoodPro';
    vcalc = parseFloat(document.getElementById(scalc).innerHTML) / 100;
    var spro = svalue + '_LblCalcPro';
    var vpro = round2(vcalc * vgrams);
    document.getElementById(spro).innerHTML = vpro;

    //grab old protein value
    sold = svalue + '_LblOldPro';
    oldamt = parseFloat(document.getElementById(sold).innerHTML);
    //new total protein is old total protein - old pro + new pro
    newtot = round2(parseFloat(document.getElementById('LblTotalPro').innerHTML) - oldamt + vpro);
    document.getElementById('LblTotalPro').innerHTML = newtot;
    document.getElementById(sold).innerHTML = vpro;
    var vprotot = newtot;

    //new fiber calculation
    var sfiber = svalue + '_LblFiber';
    if (document.getElementById(sfiber) != null) {
        vcalc = parseFloat(document.getElementById(sfiber).innerHTML) / 100;
        sfiber = svalue + '_LblCalcFiber';
        var vfcalc = round2(vcalc * vgrams);
        document.getElementById(sfiber).innerHTML = vfcalc;
        //new fiber total
        sold = svalue + '_LblOldFiber';
        oldamt = parseFloat(document.getElementById(sold).innerHTML);
        //new total fiber is old total fiber - old fiber + new fiber
        newtot = round2(parseFloat(document.getElementById('LblTotalFiber').innerHTML) - oldamt + vfcalc);
        document.getElementById('LblTotalFiber').innerHTML = newtot;
        document.getElementById(sold).innerHTML = vfcalc;
    }

    //new carb calculation
    var sivcarb = svalue + '_LblIVCarb';
    var vivcarb = document.getElementById(sivcarb).innerHTML;

    //if food has ivcarb then use it in calculation
    if (parseFloat(vivcarb) > 0) {
        scalc = svalue + '_LblIVCarb';
    } else {
        scalc = svalue + '_LblFoodCarb';
    }
    vcalc = parseFloat(document.getElementById(scalc).innerHTML) / 100;
    var vcarb = round2(vcalc * vgrams);
    var scarb = svalue + '_LblCalcCarb';
    document.getElementById(scarb).innerHTML = vcarb;

    //grab old carb value
    sold = svalue + '_LblOldCarb';
    oldamt = parseFloat(document.getElementById(sold).innerHTML);

    //new total carb is old total carb - old carb + new carb
    newtot = round2(parseFloat(document.getElementById('LblTotalCarb').innerHTML) - oldamt + vcarb);
    document.getElementById('LblTotalCarb').innerHTML = newtot;
    document.getElementById(sold).innerHTML = vcarb;
    var vcarbtot = newtot;

    //new pro plus carb total
    document.getElementById('LblTotalUnits').innerHTML = round2(parseFloat(document.getElementById('LblTotalPro').innerHTML) + parseFloat(document.getElementById('LblTotalCarb').innerHTML));

    //new calorie calculation
    if (parseFloat(vivcarb) > 0) {
        vcalc = Math.round((vfat * 9) + (vpro * 4) + (vcarb * 3.4));
    } else {
        vcalc = Math.round((vfat * 9) + (vpro * 4) + (vcarb * 4));
    }
    var scal = svalue + '_LblCalcCal';
    document.getElementById(scal).innerHTML = vcalc;

    //grab old calorie value
    sold = svalue + '_LblOldCal';
    oldamt = parseFloat(document.getElementById(sold).innerHTML.replace(/,/g, ''));
    //new total carb is old total carb - old carb + new carb
    newtot = round2(parseFloat(document.getElementById('LblTotalCal').innerHTML.replace(/,/g, '')) - oldamt + vcalc);
    document.getElementById('LblTotalCal').innerHTML = newtot;
    document.getElementById(sold).innerHTML = vcalc;

	//ratio calculation
    //document.form1.txtotratio.value = round2(totfat/(totpro + totcarb)) + ':1'
    if (parseFloat(document.getElementById('LblTotalPro').innerHTML) + parseFloat(document.getElementById('LblTotalCarb').innerHTML) != 0) {
        document.getElementById('LblTotalRatio').innerHTML = round2(parseFloat(document.getElementById('LblTotalFat').innerHTML) / (parseFloat(document.getElementById('LblTotalPro').innerHTML) + parseFloat(document.getElementById('LblTotalCarb').innerHTML))) + ':1';
    } else {
        document.getElementById('LblTotalRatio').innerHTML = '0';
    }
}

