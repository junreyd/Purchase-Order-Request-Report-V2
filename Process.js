import {
    getAllData
} from "./API.js";

getAllData().then(dataRes => {

    //Insert dropdown year
    var lodashYear = [];
    for (let o = 0; o < dataRes.length; o++) {
        lodashYear.push(dataRes[o].CreatedYear);
    }

    var yearArrUnq = [];
    for (let e = 0; e < _.uniq(lodashYear).length; e++) {
        var yrval = _.uniq(lodashYear)[e];
        yearArrUnq.push(yrval);
        $("#year").append("<option value=" + yrval + ">" + yrval + "</option>");
    }

    //Insert dropdown month if the selected year is equal to ...
    let currYear = new Date().getFullYear().toString();
    let currMonth = new Date().getMonth().toString();
    $("#year").on('change', function () {
        $('#month').empty();

        let year = this.value;
        let monthArr = [];

        for (let i = 0; i < dataRes.length; i++) {
            if (year === dataRes[i].CreatedYear) {
                monthArr.push(dataRes[i]);
            }
        }

        const unqMonth = [...new Set(monthArr.map(item => item.CreatedMonth))];
        for (let i = 0; i < unqMonth.length; i++) {
            let month = unqMonth[i];

            var res_month_val = (month === 'January' ? '0' : 0) || (month === 'February' ? '1' : 0) || (month === 'March' ? '2' : 0) || (month === 'April' ? '3' : 0) || (month === 'May' ? '4' : 0) || (month === 'June' ? '5' : 0) || (month === 'July' ? '6' : 0) || (month === 'August' ? '7' : 0) || (month === 'September' ? '8' : 0) || (month === 'October' ? '9' : 0) || (month === 'November' ? '10' : 0) || (month === 'December' ? '11' : 0);
            $('#month').append('<option value="' + res_month_val + '">' + month + '</option>');
        }

        $("#month").on('change', function () {
            var month_ = this.value;
            func_tableMonth(month_, year, dataRes);
        });

        if (year === currYear) {
            var tmonth = '';
            var fmonth = '';

            for (let r = 0; r < unqMonth.length; r++) {
                var monthTonum = (unqMonth[r] === 'January' ? '0' : 0) || (unqMonth[r] === 'February' ? '1' : 0) || (unqMonth[r] === 'March' ? '2' : 0) || (unqMonth[r] === 'April' ? '3' : 0) || (unqMonth[r] === 'May' ? '4' : 0) || (unqMonth[r] === 'June' ? '5' : 0) || (unqMonth[r] === 'July' ? '6' : 0) || (unqMonth[r] === 'August' ? '7' : 0) || (unqMonth[r] === 'September' ? '8' : 0) || (unqMonth[r] === 'October' ? '9' : 0) || (unqMonth[r] === 'November' ? '10' : 0) || (unqMonth[r] === 'December' ? '11' : 0);
                var num = Number(currMonth) - 1;
                var stringNum = num.toString();

                if (currMonth === monthTonum) {
                    tmonth += monthTonum;
                } else if (stringNum === monthTonum) {
                    fmonth = stringNum;
                }
            }

            if (currMonth === tmonth) {
                $("#month").val(tmonth).change();
            } else {
                $("#month").val(fmonth).change();
            }


        } else if (year === '2018') {
            $("#month").val('7').change();
        } else {
            $("#month").val('0').change();
        }

        ControllerGraph(this.value, dataRes);
        func_tableYR(year, dataRes);
    });

    let curryr = '';
    let minuscurryr = '';

    for (let p = 0; p < yearArrUnq.length; p++) {
        const yr = yearArrUnq[p];
        if (yr === currYear) {
            curryr += yr;
        } else if (yr.length - 1) {
            minuscurryr = yr;
        }
    }

    if (currYear === curryr) {
        $("#year").val(curryr).change();
    } else {
        $("#year").val(minuscurryr).change();
    }

});


function ControllerGraph(year_, dateResult) {

    $("#por").on('change', function () {
        let chart = this.value + 'Chart';
        document.querySelectorAll('canvas')
            .forEach(c => {
                c.style.display = (c.id === chart) ? 'inherit' : 'none';
            });

        if (chart === 'PORChart') {
            GraphPOR(year_, dateResult);
        } else if (chart === 'OvTChart') {
            GraphOntimeOverdue(year_, dateResult);
        } else if (chart === 'AvRChart') {
            GraphApprRej(year_, dateResult);
        }
    });
    var porval = $('#por').val();
    $("#por").val(porval).change();
}


function func_tableYR(year_val, data_val) {
    $('#enps_table_body').empty();

    $('#tbl_yr').text('POR Table year of ' + year_val);
    let data_val_sort = data_val.sort((a, b) => a.ID - b.ID); //sort items by ID to ascending

    let unq_month = [];
    let unq_year = [];
    let total_por_arr = [];
    let [jan_por, feb_por, mar_por, april_por, may_por, june_por, july_por, aug_por, sept_por, oct_por, nov_por, dec_por] = Array(12).fill(0);
    let total_approved_arr = [];
    let [jan_tapp, feb_tapp, mar_tapp, april_tapp, may_tapp, june_tapp, july_tapp, aug_tapp, sept_tapp, oct_tapp, nov_tapp, dec_tapp] = Array(12).fill(0);
    let total_reject_arr = [];
    let [jan_trej, feb_trej, mar_trej, april_trej, may_trej, june_trej, july_trej, aug_trej, sept_trej, oct_trej, nov_trej, dec_trej] = Array(12).fill(0);
    let overdue_arr = [];
    let [jan_, feb_, mar_, april_, may_, june_, july_, aug_, sept_, oct_, nov_, dec_] = Array(12).fill(0);

    let count = 1;

    for (let i = 0; i < data_val_sort.length; i++) {

        const year_db = data_val_sort[i].CreatedYear;
        const month_db = data_val_sort[i].CreatedMonth;
        const status = data_val_sort[i].CEOapproval;
        const overdue = data_val_sort[i].Overdue;
        const closedMonth = data_val_sort[i].PurchaserClosedMonth;
        const closed = data_val_sort[i].PurchaserClosed;
        const immapproval = data_val_sort[i].Immapproval;

        const dateRejected = new Date(data_val_sort[i].CEOApprovalDate).getMonth();

        if (year_val === year_db) {
            if ($.inArray(month_db, unq_month) === -1) unq_month.push(month_db);
            if ($.inArray(year_db, unq_year) === -1) unq_year.push(year_db);

            //JANUARY
            if (month_db === 'January') {
                jan_por++;
            }
            if (closedMonth === 'January' && status === 'Approved') {
                jan_tapp++;
            }
            if (dateRejected === 0) {
                (status === 'Rejected' || immapproval === 'Rejected') ? jan_trej++ : 0;
            }
            if (closedMonth === 'January' && overdue > 96) {
                jan_++;
            }

            //FEBRUARY
            if (month_db === 'February') {
                feb_por++;
            }
            if (closedMonth === 'February' && status === 'Approved') {
                feb_tapp++;
            }
            if (dateRejected === 1) {
                (status === 'Rejected' || immapproval === 'Rejected') ? feb_trej++ : 0;
            }
            if (closedMonth === 'February' && overdue > 96) {
                feb_++;
            }

            //MARCH
            if (month_db === 'March') {
                mar_por++;
            }
            if (closedMonth === 'March' && status === 'Approved') {
                mar_tapp++;
            }
            if (dateRejected === 2) {
                (status === 'Rejected' || immapproval === 'Rejected') ? mar_trej++ : 0;
            }
            if (closedMonth === 'March' && overdue > 96) {
                mar_++;
            }

            //APRIL
            if (month_db === 'April') {
                april_por++;
            }
            if (closedMonth === 'April' && status === 'Approved') {
                april_tapp++;
            }
            if (dateRejected === 3) {
                (status === 'Rejected' || immapproval === 'Rejected') ? april_trej++ : 0;
            }
            if (closedMonth === 'April' && overdue > 96) {
                april_++;
            }

            //MAY
            if (month_db === 'May') {
                may_por++;
            }
            if (closedMonth === 'May' && status === 'Approved') {
                may_tapp++;
            }
            if (dateRejected === 4) {
                (status === 'Rejected' || immapproval === 'Rejected') ? may_trej++ : 0;
            }
            if (closedMonth === 'May' && overdue > 96) {
                may_++;
            }

            //JUNE
            if (month_db === 'June') {
                june_por++;
            }
            if (closedMonth === 'June' && status === 'Approved') {
                june_tapp++;
            }
            if (dateRejected === 5) {
                (status === 'Rejected' || immapproval === 'Rejected') ? june_trej++ : 0;
            }
            if (closedMonth === 'June' && overdue > 96) {
                june_++;
            }

            //JULY
            if (month_db === 'July') {
                july_por++;
            }
            if (closedMonth === 'July' && status === 'Approved') {
                july_tapp++;
            }
            if (dateRejected === 6) {
                (status === 'Rejected' || immapproval === 'Rejected') ? july_trej++ : 0;
            }
            if (closedMonth === 'July' && overdue > 96) {
                july_++;
            }

            //AUGUST
            if (month_db === 'August') {
                aug_por++;
            }
            if (closedMonth === 'August' && status === 'Approved') {
                aug_tapp++;
            }
            if (dateRejected === 7) {
                (status === 'Rejected' || immapproval === 'Rejected') ? aug_trej++ : 0;
            }
            if (closedMonth === 'August' && overdue > 96) {
                aug_++;
            }

            //SEPTEMBER
            if (month_db === 'September') {
                sept_por++;
            }
            if (closedMonth === 'September' && status === 'Approved') {
                sept_tapp++;
            }
            if (dateRejected === 8) {
                (status === 'Rejected' || immapproval === 'Rejected') ? sept_trej++ : 0;
            }
            if (closedMonth === 'September' && overdue > 96) {
                sept_++;
            }

            //OCTOBER
            if (month_db === 'October') {
                oct_por++;
            }
            if (closedMonth === 'October' && status === 'Approved') {
                oct_tapp++;
            }
            if (dateRejected === 9) {
                (status === 'Rejected' || immapproval === 'Rejected') ? oct_trej++ : 0;
            }
            if (closedMonth === 'October' && overdue > 96) {
                oct_++;
            }

            //NOVEMBER
            if (month_db === 'November') {
                nov_por++;
            }
            if (closedMonth === 'November' && status === 'Approved') {
                nov_tapp++;
            }
            if (dateRejected === 10) {
                (status === 'Rejected' || immapproval === 'Rejected') ? nov_trej++ : 0;
            }
            if (closedMonth === 'November' && overdue > 96) {
                nov_++;
            }

            //DECEMBER
            if (month_db === 'December') {
                dec_por++;
            }
            if (closedMonth === 'December' && status === 'Approved') {
                dec_tapp++;
            }
            if (dateRejected === 11) {
                (status === 'Rejected' || immapproval === 'Rejected') ? dec_trej++ : 0;
            }
            if (closedMonth === 'December' && overdue > 96) {
                dec_++;
            }
        }
    }

    overdue_arr.push(jan_, feb_, mar_, april_, may_, june_, july_, aug_, sept_, oct_, nov_, dec_);
    total_por_arr.push(jan_por, feb_por, mar_por, april_por, may_por, june_por, july_por, aug_por, sept_por, oct_por, nov_por, dec_por);
    total_approved_arr.push(jan_tapp, feb_tapp, mar_tapp, april_tapp, may_tapp, june_tapp, july_tapp, aug_tapp, sept_tapp, oct_tapp, nov_tapp, dec_tapp);
    total_reject_arr.push(jan_trej, feb_trej, mar_trej, april_trej, may_trej, june_trej, july_trej, aug_trej, sept_trej, oct_trej, nov_trej, dec_trej);

    unq_month.forEach((elem_month, e) => {

        //specify the 2018 year
        var por_18 = Number(total_por_arr[e + 7]);
        let appr_18 = Number(total_approved_arr[e + 7]);
        let rej_18 = Number(total_reject_arr[e + 7]);
        let overd_18 = Number(overdue_arr[e + 7]);

        var total_pa_ = Math.round((appr_18 / por_18) * 100);
        var total_pr_ = Math.round((rej_18 / por_18) * 100);
        var total_po_ = Math.round((overd_18 / appr_18) * 100);
        var total_ontime_ = Math.round((appr_18 - overd_18) / appr_18 * 100);

        //current year and so on.. .
        let por = Number(total_por_arr[e]);
        let appr = Number(total_approved_arr[e]);
        let rej = Number(total_reject_arr[e]);
        let overd = Number(overdue_arr[e]);

        var total_pa = Math.round((appr / por) * 100);
        var total_pr = Math.round((rej / por) * 100);
        var total_po = Math.round((overd / appr) * 100);
        var total_ontime = Math.round((appr - overd) / appr * 100);

        //table for year
        if (`${year_val}` === '2018') {
            $('#enps_table_body').append(`<tr><td>${elem_month}</td><td>${total_por_arr[e + 7]}</td><td>${total_approved_arr[e + 7]}</td><td>${total_reject_arr[e + 7]}</td><td>${total_pa_}%</td><td>${total_pr_}%</td><td>${total_po_}%</td><td>${total_ontime_}%</td></tr>`);
        } else {
            $('#enps_table_body').append(`<tr><td>${elem_month}</td><td>${total_por_arr[e]}</td><td>${total_approved_arr[e]}</td><td>${total_reject_arr[e]}</td><td>${total_pa}%</td><td>${total_pr}%</td><td>${total_po}%</td><td>${total_ontime}%</td></tr>`);
        }
    });
}


function func_tableMonth(monthVal, year, data_val_) {

    $('#enps_table1').empty();

    $('#enps_table1').append(`<thead>
                <tr>
                    <th id="enps_th" align="center" rowspan="2">Item</th>
                    <th class="th_month" style="border: 1px solid #ddd;" id="enps_th" align="center"></th>
                    <th id="enps_th" align="center" rowspan="2">Total</th>
                </tr>
                <tr>
                    <th id="enps_th" align="center">Week 1</th>
                    <th id="enps_th" align="center">Week 2</th>
                    <th id="enps_th" align="center">Week 3</th>
                    <th id="enps_th" align="center">Week 4</th>
                    <th id="enps_th" align="center">Week 5</th>
                </tr>
            </thead><tbody id="enps_table1_body"></tbody>`);

    var arr_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    $('#tbl_mnt').text('POR Table month of ' + arr_month[monthVal]);
    $('.th_month').text(arr_month[monthVal]);

    var month_toNum = Number(monthVal);
    var year_toNum = Number(year);
    var indexes = arr_month[monthVal];

    var col = getWeeksStartAndEndInMonth(month_toNum, year_toNum, 'monday').length;
    $('#enps_table1').each(function () {
        var value = $(this);
        if (value.find('thead > tr > th:contains(' + indexes + ')') !== -1) { //true
            $(value.find('thead > tr > th:contains(' + indexes + ')')).attr("colspan", col);
            if (col === 4) {
                $(value.find('thead > tr > th:eq(7)')).remove();
            }
        }
    });

    let [firstWeekTotal, secondWeekTotal, thirdWeekTotal, fourthWeekTotal, fifthWeekTotal] = Array(5).fill(0);
    let [firstWeekrejected, secondWeekrejected, thirdWeekrejected, fourthWeekrejected, fifthWeekrejected] = Array(5).fill(0);

    let [firstWeekCompleted, secondWeekCompleted, thirdWeekCompleted, fourthWeekCompleted, fifthWeekCompleted] = Array(5).fill(0);
    let [firstWeekoverdue, secondWeekoverdue, thirdWeekoverdue, fourthWeekoverdue, fifthWeekoverdue] = Array(5).fill(0);
    let [firstWeekontime, secondWeekontime, thirdWeekontime, fourthWeekontime, fifthWeekontime] = Array(5).fill(0);
    let [firstWeekInProg, secondWeekInProg, thirdWeekInProg, fourthWeekInProg, fifthWeekInProg] = Array(5).fill(0);

    let count = 1;

    for (let i = 0; i < data_val_.length; i++) {

        const createdYear = data_val_[i].CreatedYear;
        const ceoapproval = data_val_[i].CEOapproval;
        const closed = data_val_[i].PurchaserClosed;
        const closedMonth = data_val_[i].PurchaserClosedMonth;
        const overdue = Number(data_val_[i].Overdue);
        const monthDB = data_val_[i].CreatedMonth;
        var getDay = weekAndDay(new Date(closed));
        var getDayClosed = weekAndDay(new Date(closed));

        if (year === createdYear) {
            // if (monthDB === indexes) {
            if (indexes === closedMonth) {
                // console.log(count++, data_val_[i]);
                if (ceoapproval === 'Approved') {
                    (getDay === 1) ? firstWeekCompleted++ : 0;
                    (getDay === 2) ? secondWeekCompleted++ : 0;
                    (getDay === 3) ? thirdWeekCompleted++ : 0;
                    (getDay === 4) ? fourthWeekCompleted++ : 0;
                    (getDay === 5) ? fifthWeekCompleted++ : 0;
                }
            }

            if (indexes === closedMonth) {
                if ((overdue < 96)) {
                    (getDayClosed === 1) ? firstWeekontime++ : 0;
                    (getDayClosed === 2) ? secondWeekontime++ : 0;
                    (getDayClosed === 3) ? thirdWeekontime++ : 0;
                    (getDayClosed === 4) ? fourthWeekontime++ : 0;
                    (getDayClosed === 5) ? fifthWeekontime++ : 0;
                }
            }

            if (indexes === closedMonth) {
                // console.log(data_val_[i]);
                if (overdue > 96) {
                    (getDayClosed === 1) ? firstWeekoverdue++ : 0;
                    (getDayClosed === 2) ? secondWeekoverdue++ : 0;
                    (getDayClosed === 3) ? thirdWeekoverdue++ : 0;
                    (getDayClosed === 4) ? fourthWeekoverdue++ : 0;
                    (getDayClosed === 5) ? fifthWeekoverdue++ : 0;
                }
            }
            // }
        }
    }

    let totalCompleted = firstWeekCompleted + secondWeekCompleted + thirdWeekCompleted + fourthWeekCompleted + fifthWeekCompleted;
    let totalInProgress = firstWeekInProg + secondWeekInProg + thirdWeekInProg + fourthWeekInProg + fifthWeekInProg;
    let totalNoOverdue = firstWeekoverdue + secondWeekoverdue + thirdWeekoverdue + fourthWeekoverdue + fifthWeekoverdue;

    let totalPORFirstweek = firstWeekTotal;
    let totalPORSecondweek = secondWeekTotal;
    let totalPORThirdweek = thirdWeekTotal;
    let totalPORFourthweek = fourthWeekTotal;
    let totalPORFifthweek = fifthWeekTotal;
    let totalPOR = totalPORFirstweek + totalPORSecondweek + totalPORThirdweek + totalPORFourthweek + totalPORFifthweek;

    let totalRejected = firstWeekrejected + secondWeekrejected + thirdWeekrejected + fourthWeekrejected + fifthWeekrejected;

    let totalOnTime = firstWeekontime + secondWeekontime + thirdWeekontime + fourthWeekontime + fifthWeekontime;

    // ontime
    let percentOntimefirstweek = ((firstWeekontime / firstWeekCompleted) * 100).toFixed(2);
    let percentOntimesecondweek = ((secondWeekontime / secondWeekCompleted) * 100).toFixed(2);
    let percentOntimethirdweek = ((thirdWeekontime / thirdWeekCompleted) * 100).toFixed(2);
    let percentOntimefourthweek = ((fourthWeekontime / fourthWeekCompleted) * 100).toFixed(2);
    let percentOntimefifthweek = ((fifthWeekontime / fifthWeekCompleted) * 100).toFixed(2);


    var firstweekPontime = isNaN(percentOntimefirstweek) ? 0 : parseFloat(percentOntimefirstweek).toString();
    var secondweekPontime = isNaN(percentOntimesecondweek) ? 0 : parseFloat(percentOntimesecondweek).toString();
    var thirdweekPontime = isNaN(percentOntimethirdweek) ? 0 : parseFloat(percentOntimethirdweek).toString();
    var fourthweekPontime = isNaN(percentOntimefourthweek) ? 0 : parseFloat(percentOntimefourthweek).toString();
    var fifthweekPontime = isNaN(percentOntimefifthweek) ? 0 : parseFloat(percentOntimefifthweek).toString();

    let totpw = ((totalOnTime / totalCompleted) * 100).toFixed(2);
    let totalOnTimePerWeek = isNaN(totpw) ? 0 : parseFloat(totpw).toString();

    // overdue
    let percentOverduefirstweek = ((firstWeekoverdue / firstWeekCompleted) * 100).toFixed(2);
    let percentOverduesecondweek = ((secondWeekoverdue / secondWeekCompleted) * 100).toFixed(2);
    let percentOverduethirdweek = ((thirdWeekoverdue / thirdWeekCompleted) * 100).toFixed(2);
    let percentOverduefourthweek = ((fourthWeekoverdue / fourthWeekCompleted) * 100).toFixed(2);
    let percentOverduefifthweek = ((fifthWeekoverdue / fifthWeekCompleted) * 100).toFixed(2);

    var firstweekPoverdue = isNaN(percentOverduefirstweek) ? 0 : parseFloat(percentOverduefirstweek).toString();
    var secondweekPoverdue = isNaN(percentOverduesecondweek) ? 0 : parseFloat(percentOverduesecondweek).toString();
    var thirdweekPoverdue = isNaN(percentOverduethirdweek) ? 0 : parseFloat(percentOverduethirdweek).toString();
    var fourthweekPoverdue = isNaN(percentOverduefourthweek) ? 0 : parseFloat(percentOverduefourthweek).toString();
    var fifthweekPoverdue = isNaN(percentOverduefifthweek) ? 0 : parseFloat(percentOverduefifthweek).toString();

    let ttnopw = ((totalNoOverdue / totalCompleted) * 100).toFixed(2);
    let totaltotalNoOverduePerWeek = isNaN(ttnopw) ? 0 : parseFloat(ttnopw).toString();

    $('#enps_table1_body').append(`

    <tr>
    <td>Completed</td>
   <td>${firstWeekCompleted}</td>
    <td>${secondWeekCompleted}</td>
    <td>${thirdWeekCompleted}</td>
    <td>${fourthWeekCompleted}</td>
    <td>${fifthWeekCompleted}</td>
    <td>${totalCompleted}</td>
    </tr>

    <tr>
    <td>On time request</td>
    <td>${firstWeekontime}</td>
    <td>${secondWeekontime}</td>
    <td>${thirdWeekontime}</td>
    <td>${fourthWeekontime}</td>
    <td>${fifthWeekontime}</td>
    <td>${totalOnTime}</td>
    </tr>

    <tr>
    <td>Overdue request</td>
    <td>${firstWeekoverdue}</td>
    <td>${secondWeekoverdue}</td>
    <td>${thirdWeekoverdue}</td>
    <td>${fourthWeekoverdue}</td>
    <td>${fifthWeekoverdue}</td>
    <td>${totalNoOverdue}</td>
    </tr>

        <tr>
    <td>Percent overdue request</td>
    <td>${firstweekPoverdue}%</td>
    <td>${secondweekPoverdue}%</td>
    <td>${thirdweekPoverdue}%</td>
    <td>${fourthweekPoverdue}%</td>
    <td>${fifthweekPoverdue}%</td>
    <td>${totaltotalNoOverduePerWeek}%</td>

    <tr>
    <td>Percent on time request</td>
    <td>${firstweekPontime}%</td>
    <td>${secondweekPontime}%</td>
    <td>${thirdweekPontime}%</td>
    <td>${fourthweekPontime}%</td>
    <td>${fifthweekPontime}%</td>
    <td>${totalOnTimePerWeek}%</td>
    </tr>



    <tr class=targetOntime>
    <td>Percent Target OnTime</td>
    <td>100%</td>
    <td>100%</td>
    <td>100%</td>
    <td>100%</td>
    <td>100%</td>
    <td>100%</td>
    </tr>
    `);
    $('#loader_show_hide').hide();
    $('.targetOntime').children('td').css('background-color', 'rgb(166, 202, 180)');

    var col = getWeeksStartAndEndInMonth(month_toNum, year_toNum, 'monday').length;
    $('#enps_table1_body').each(function () {
        var value = $(this);
        if (value.find('thead > tr > th:contains(' + indexes + ')') !== -1) { //true
            $(value.find('thead > tr > th:contains(' + indexes + ')')).attr("colspan", col);
            if (col === 4) {
                $(value.find('tr > td:eq(5)')).remove();
                $(value.find('tr > td:eq(11)')).remove();
                $(value.find('tr > td:eq(17)')).remove();
                $(value.find('tr > td:eq(23)')).remove();
                $(value.find('tr > td:eq(29)')).remove();
                $(value.find('tr > td:eq(35)')).remove();
                $(value.find('tr > td:eq(41)')).remove();
                $(value.find('tr > td:eq(47)')).remove();
                $(value.find('tr > td:eq(53)')).remove();

            }
        }
    });
}


function getWeeksStartAndEndInMonth(month, year, _start) {
    // let monthNames = ["January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"
    //     ],
    //     d = new Date();
    // console.log("The current month is " + monthNames[d.getMonth()]);
    let weeks = [],
        firstDate = new Date(year, month, 1),
        lastDate = new Date(year, month + 1, 0),
        numDays = lastDate.getDate();
    var c = Date()
    let start = 1;
    let end = 7 - firstDate.getDay();
    if (_start == 'monday') {
        if (firstDate.getDay() === 0) {
            end = 1;
        } else {
            end = 7 - firstDate.getDay() + 1;
        }
    }
    while (start <= numDays) {
        var businessWeekEnd = end - 2
        if (businessWeekEnd > 0) {
            if (businessWeekEnd > start) {
                weeks.push({
                    start: start,
                    end: businessWeekEnd
                });
            } else {
                //Check for last day else end date is within 5 days of the week.
                weeks.push({
                    start: start,
                    end: end
                });
            }
        }
        start = end + 1;
        end = end + 7;
        end = start === 1 && end === 8 ? 1 : end;
        if (end > numDays) {
            end = numDays;
        }
    }

    weeks.forEach(week => {
        var _s = parseInt(week.start, 10) + 1,
            _e = parseInt(week.end, 10) + 1;
        // console.log(new Date(year, month, _s).toJSON().slice(0, 10).split('-').reverse().join('/') + " - " + new Date(year, month, _e).toJSON().slice(0, 10).split('-').reverse().join('/'));
        // console.log(((_e - _s) + 1) * 8)
    });
    return weeks;
}


function weekAndDay(date) {
    var nth = 0; // returning variable.
    var timestamp = date.getTime(); // get UTC timestamp of date.
    var month = date.getMonth(); // get current month.
    var m = month; // save temp value of month.

    while (m == month) { // check if m equals our date's month.
        nth++; // increment our week count.
        // update m to reflect previous week (previous to last value of m).
        m = new Date(timestamp - nth * 604800000).getMonth();
    }
    return nth;
}


function GraphPOR(year, data) {

    let [count_jan, count_feb, count_mar, count_april, count_may, count_june, count_july, count_aug, count_sept, count_oct, count_nov, count_dec] = Array(12).fill(0);
    let [jan_tapp, feb_tapp, mar_tapp, april_tapp, may_tapp, june_tapp, july_tapp, aug_tapp, sept_tapp, oct_tapp, nov_tapp, dec_tapp] = Array(12).fill(0);
    let [jan_trej, feb_trej, mar_trej, april_trej, may_trej, june_trej, july_trej, aug_trej, sept_trej, oct_trej, nov_trej, dec_trej] = Array(12).fill(0);

    for (let i = 0; i < data.length; i++) {

        const year_db = data[i].CreatedYear;
        const month_db = data[i].CreatedMonth;
        const statusCEO = data[i].CEOapproval;
        const statusImm = data[i].Immapproval;

        const closedMonth = data[i].PurchaserClosedMonth;
        const closedYR = new Date(data[i].PurchaserClosed).getFullYear();
        const dateRejected = new Date(data[i].CEOApprovalDate).getMonth();

        if (year_db === year) {
            $('#PORChart').remove();

            //JANUARY
            if (month_db === 'January') {
                count_jan++;
            }
            if (closedYR == year && closedMonth === 'January' && statusCEO === 'Approved') {
                jan_tapp++;
            }
            if (dateRejected === 0) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? jan_trej++ : 0;
            }

            //FEBRUARY
            if (month_db === 'February') {
                count_feb++;
            }
            if (closedYR == year && closedMonth === 'February' && statusCEO === 'Approved') {
                feb_tapp++;
            }
            if (dateRejected === 1) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? feb_trej++ : 0;
            }

            //MARCH
            if (month_db === 'March') {
                count_mar++;
            }
            if (closedYR == year && closedMonth === 'March' && statusCEO === 'Approved') {
                mar_tapp++;
            }
            if (dateRejected === 2) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? mar_trej++ : 0;
            }

            //APRIL
            if (month_db === 'April') {
                count_april++;
            }
            if (closedYR == year && closedMonth === 'April' && statusCEO === 'Approved') {
                april_tapp++;
            }
            if (dateRejected === 3) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? april_trej++ : 0;
            }

            //MAY
            if (month_db === 'May') {
                count_may++;
            }
            if (closedYR == year && closedMonth === 'May' && statusCEO === 'Approved') {
                may_tapp++;
            }
            if (dateRejected === 4) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? may_trej++ : 0;
            }

            //JUNE
            if (month_db === 'June') {
                count_june++;
            }
            if (closedYR == year && closedMonth === 'June' && statusCEO === 'Approved') {
                june_tapp++;
            }
            if (dateRejected === 5) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? june_trej++ : 0;
            }

            //JULY
            if (month_db === 'July') {
                count_july++;
            }
            if (closedYR == year && closedMonth === 'July' && statusCEO === 'Approved') {
                july_tapp++;
            }
            if (dateRejected === 6) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? july_trej++ : 0;
            }

            //AUGUST
            if (month_db === 'August') {
                count_aug++;
            }
            if (closedYR == year && closedMonth === 'August' && statusCEO === 'Approved') {
                aug_tapp++;
            }
            if (dateRejected === 7) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? aug_trej++ : 0;
            }

            //SEPTEMBER
            if (month_db === 'September') {
                count_sept++;
            }
            if (closedYR == year && closedMonth === 'September' && statusCEO === 'Approved') {
                sept_tapp++;
            }
            if (dateRejected === 8) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? sept_trej++ : 0;
            }

            //OCTOBER
            if (month_db === 'October') {
                count_oct++;
            }
            if (closedYR == year && closedMonth === 'October' && statusCEO === 'Approved') {
                oct_tapp++;
            }
            if (dateRejected === 9) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? oct_trej++ : 0;
            }

            //NOVEMBER
            if (month_db === 'November') {
                count_nov++;
            }
            if (closedYR == year && closedMonth === 'November' && statusCEO === 'Approved') {
                nov_tapp++;
            }
            if (dateRejected === 10) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? nov_trej++ : 0;
            }

            //DECEMBER
            if (month_db === 'December') {
                count_dec++;
            }
            if (closedYR == year && closedMonth === 'December' && statusCEO === 'Approved') {
                dec_tapp++;
            }
            if (dateRejected === 11) {
                (statusCEO === 'Rejected' || statusImm === 'Rejected') ? dec_trej++ : 0;
            }
        }
    }

    let total_por = [];
    let total_approved = [];
    let total_reject = [];
    total_por.push(count_jan, count_feb, count_mar, count_april, count_may, count_june, count_july, count_aug, count_sept, count_oct, count_nov, count_dec);
    total_approved.push(jan_tapp, feb_tapp, mar_tapp, april_tapp, may_tapp, june_tapp, july_tapp, aug_tapp, sept_tapp, oct_tapp, nov_tapp, dec_tapp);
    total_reject.push(jan_trej, feb_trej, mar_trej, april_trej, may_trej, june_trej, july_trej, aug_trej, sept_trej, oct_trej, nov_trej, dec_trej);

    $('#canvas_por_chart').append(`<canvas id="PORChart" style="position: relative;
                            width: 98%;
                            height: 381px;
                            padding-bottom: 16px;
                            padding-right: 19px;
                            padding-left: 19px;
                            padding-top: 36px;"></canvas>`);

    var ctx = document.getElementById('PORChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line', // 
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                    label: "Total POR",
                    data: total_por,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#1BA1E2',
                    backgroundColor: 'transparent',
                    pointBorderColor: '#1BA1E2',
                    pointBackgroundColor: 'lightgreen',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHitRadius: 30,
                    pointBorderWidth: 2
                },
                {
                    label: "Total Approved POR",
                    data: total_approved,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#E97E37',
                    backgroundColor: 'transparent',
                    pointBorderColor: '#E97E37',
                    pointBackgroundColor: 'lightgreen',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHitRadius: 30,
                    pointBorderWidth: 2
                },
                {
                    label: "Total Reject POR",
                    data: total_reject,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#A4A4A4',
                    backgroundColor: 'transparent',
                    pointBorderColor: '#A4A4A4',
                    pointBackgroundColor: 'lightgreen',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHitRadius: 30,
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                }
            },
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


function GraphOntimeOverdue(year, response) {
    let [jan_ot, feb_ot, mar_ot, april_ot, may_ot, june_ot, july_ot, aug_ot, sept_ot, oct_ot, nov_ot, dec_ot] = Array(12).fill(0);
    let [jan_, feb_, mar_, april_, may_, june_, july_, aug_, sept_, oct_, nov_, dec_] = Array(12).fill(0);

    for (let i = 0; i < response.length; i++) {
        const year_db = response[i].CreatedYear;
        const month_db = response[i].CreatedMonth;
        const overdue = response[i].Overdue;
        const closedMonth = response[i].PurchaserClosedMonth;
        const closedYR = new Date(response[i].PurchaserClosed).getFullYear();


        if (year_db === year) {
            $('#OvTChart').remove();

            //JANUARY
            if (closedYR == year && closedMonth === 'January' && overdue < 96) {
                jan_ot++;
            }
            if (closedYR == year && closedMonth === 'January' && overdue > 96) {
                jan_++;
            }

            //FEBRUARY
            if (closedYR == year && closedMonth === 'February' && overdue < 96) {
                feb_ot++;
            }
            if (closedYR == year && closedMonth === 'February' && overdue > 96) {
                feb_++;
            }

            //MARCH
            if (closedYR == year && closedMonth === 'March' && overdue < 96) {
                mar_ot++;
            }
            if (closedYR == year && closedMonth === 'March' && overdue > 96) {
                mar_++;
            }

            //APRIL
            if (closedYR == year && closedMonth === 'April' && overdue < 96) {
                april_ot++;
            }
            if (closedYR == year && closedMonth === 'April' && overdue > 96) {
                april_++;
            }

            //MAY
            if (closedYR == year && closedMonth === 'May' && overdue < 96) {
                may_ot++;
            }
            if (closedYR == year && closedMonth === 'May' && overdue > 96) {
                may_++;
            }

            //JUNE
            if (closedYR == year && closedMonth === 'June' && overdue < 96) {
                june_ot++;
            }
            if (closedYR == year && closedMonth === 'June' && overdue > 96) {
                june_++;
            }

            //JULY
            if (closedYR == year && closedMonth === 'July' && overdue < 96) {
                july_ot++;
            }
            if (closedYR == year && closedMonth === 'July' && overdue > 96) {
                july_++;
            }

            //AUGUST
            if (closedYR == year && closedMonth === 'August' && overdue < 96) {
                aug_ot++;
            }
            if (closedYR == year && closedMonth === 'August' && overdue > 96) {
                aug_++;
            }

            //SEPTEMBER
            if (closedYR == year && closedMonth === 'September' && overdue < 96) {
                sept_ot++;
            }
            if (closedYR == year && closedMonth === 'September' && overdue > 96) {
                sept_++;
            }

            //OCTOBER
            if (closedYR == year && closedMonth === 'October' && overdue < 96) {
                oct_ot++;
            }
            if (closedYR == year && closedMonth === 'October' && overdue > 96) {
                oct_++;
            }

            //NOVEMBER
            if (closedYR == year && closedMonth === 'November' && overdue < 96) {
                nov_ot++;
            }
            if (closedYR == year && closedMonth === 'November' && overdue > 96) {
                nov_++;
            }

            //DECEMBER
            if (closedYR == year && closedMonth === 'December' && overdue < 96) {
                dec_ot++;
            }
            if (closedYR == year && closedMonth === 'December' && overdue > 96) {
                dec_++;
            }
        }
    }

    let total_po_arr = [];
    let total_ontime_arr = [];
    total_po_arr.push(jan_, feb_, mar_, april_, may_, june_, july_, aug_, sept_, oct_, nov_, dec_);
    total_ontime_arr.push(jan_ot, feb_ot, mar_ot, april_ot, may_ot, june_ot, july_ot, aug_ot, sept_ot, oct_ot, nov_ot, dec_ot);

    $('#canvas_por_chart').append(`<canvas id="OvTChart" style="position: relative;
                        width: 98%;
                        height: 381px;
                        padding-bottom: 16px;
                        padding-right: 19px;
                        padding-left: 19px;
                        padding-top: 36px;"></canvas>`);

    var ctx = document.getElementById('OvTChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                data: total_ontime_arr,
                label: 'Total Ontime',
                fill: true,
                backgroundColor: "#A1B566",
                borderWidth: 1
            }, {
                data: total_po_arr,
                label: 'Total Overdue',
                fill: true,
                backgroundColor: "#66A1B5",
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                }
            },
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}


function GraphApprRej(year, response) {

    let [jan_tapp, feb_tapp, mar_tapp, april_tapp, may_tapp, june_tapp, july_tapp, aug_tapp, sept_tapp, oct_tapp, nov_tapp, dec_tapp] = Array(12).fill(0);
    let [jan_trej, feb_trej, mar_trej, april_trej, may_trej, june_trej, july_trej, aug_trej, sept_trej, oct_trej, nov_trej, dec_trej] = Array(12).fill(0);

    for (let i = 0; i < response.length; i++) {
        const year_db = response[i].CreatedYear;
        const month_db = response[i].CreatedMonth;
        const status = response[i].CEOapproval;
        const closedMonth = response[i].PurchaserClosedMonth;
        const immapproval = response[i].Immapproval;
        const closedYR = new Date(response[i].PurchaserClosed).getFullYear();

        const dateRejected = new Date(response[i].CEOApprovalDate).getMonth();

        if (year_db === year) {
            $('#AvRChart').remove();

            //JANUARY
            if (closedYR == year && closedMonth === 'January' && status === 'Approved') {
                jan_tapp++;
            }
            if (dateRejected === 0) {
                (status === 'Rejected' || immapproval === 'Rejected') ? jan_trej++ : 0;
            }

            //FEBRUARY
            if (closedYR == year && closedMonth === 'February' && status === 'Approved') {
                feb_tapp++;
            }
            if (dateRejected === 1) {
                (status === 'Rejected' || immapproval === 'Rejected') ? feb_trej++ : 0;
            }

            //MARCH
            if (closedYR == year && closedMonth === 'March' && status === 'Approved') {
                mar_tapp++;
            }
            if (dateRejected === 2) {
                (status === 'Rejected' || immapproval === 'Rejected') ? mar_trej++ : 0;
            }

            //APRIL
            if (closedYR == year && closedMonth === 'April' && status === 'Approved') {
                april_tapp++;
            }
            if (dateRejected === 3) {
                (status === 'Rejected' || immapproval === 'Rejected') ? april_trej++ : 0;
            }

            //MAY
            if (closedYR == year && closedMonth === 'May' && status === 'Approved') {
                may_tapp++;
            }
            if (dateRejected === 4) {
                (status === 'Rejected' || immapproval === 'Rejected') ? may_trej++ : 0;
            }

            //JUNE
            if (closedYR == year && closedMonth === 'June' && status === 'Approved') {
                june_tapp++;
            }
            if (dateRejected === 5) {
                (status === 'Rejected' || immapproval === 'Rejected') ? june_trej++ : 0;
            }

            //JULY
            if (closedYR == year && closedMonth === 'July' && status === 'Approved') {
                july_tapp++;
            }
            if (dateRejected === 6) {
                (status === 'Rejected' || immapproval === 'Rejected') ? july_trej++ : 0;
            }

            //AUGUST
            if (closedYR == year && closedMonth === 'August' && status === 'Approved') {
                aug_tapp++;
            }
            if (dateRejected === 7) {
                (status === 'Rejected' || immapproval === 'Rejected') ? aug_trej++ : 0;
            }

            //SEPTEMBER
            if (closedYR == year && closedMonth === 'September' && status === 'Approved') {
                sept_tapp++;
            }
            if (dateRejected === 8) {
                (status === 'Rejected' || immapproval === 'Rejected') ? sept_trej++ : 0;
            }

            //OCTOBER
            if (closedYR == year && closedMonth === 'October' && status === 'Approved') {
                oct_tapp++;
            }
            if (dateRejected === 9) {
                (status === 'Rejected' || immapproval === 'Rejected') ? oct_trej++ : 0;
            }

            //NOVEMBER
            if (closedYR == year && closedMonth === 'November' && status === 'Approved') {
                nov_tapp++;
            }
            if (dateRejected === 10) {
                (status === 'Rejected' || immapproval === 'Rejected') ? nov_trej++ : 0;
            }

            //DECEMBER
            if (closedYR == year && closedMonth === 'December' && status === 'Approved') {
                dec_tapp++;
            }
            if (dateRejected === 11) {
                (status === 'Rejected' || immapproval === 'Rejected') ? dec_trej++ : 0;
            }
        }
    }

    let total_approved = [];
    let total_reject = [];

    total_approved.push(jan_tapp, feb_tapp, mar_tapp, april_tapp, may_tapp, june_tapp, july_tapp, aug_tapp, sept_tapp, oct_tapp, nov_tapp, dec_tapp);
    total_reject.push(jan_trej, feb_trej, mar_trej, april_trej, may_trej, june_trej, july_trej, aug_trej, sept_trej, oct_trej, nov_trej, dec_trej);

    $('#canvas_por_chart').append(`<canvas id="AvRChart" style="position: relative;
                                    width: 98%;
                                    height: 381px;
                                    padding-bottom: 16px;
                                    padding-right: 19px;
                                    padding-left: 19px;
                                    padding-top: 36px;"></canvas>`);


    var ourLineChart = document.getElementById('AvRChart').getContext('2d');
    var myChart = new Chart(ourLineChart, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                data: total_approved,
                label: 'Total Approved',
                fill: true,
                backgroundColor: "#E97E37",
                borderWidth: 1
            }, {
                data: total_reject,
                label: 'Total Rejected',
                fill: true,
                backgroundColor: "#A4A4A4",
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                }
            },
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}