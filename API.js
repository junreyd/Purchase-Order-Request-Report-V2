export const getAllData = () => {
    $('#loader_show_hide').show();

    const API = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbyTitle('Purchase Order Requests')/items?$top=1290000`;

    return axios.get(API, {
        headers: {
            "accept": "application/json;odata=verbose"
        }
    }).then(res => {
        const posts = [];

        const requests = res.data.d.results.map(val => {
            var obj = {};

            const url = `${_spPageContextInfo.webAbsoluteUrl}/_layouts/15/versions.aspx?list={F4B955FE-AC03-4331-AAED-E7DA906376C8}&ID=${val.ID}`;
            return axios.get(url).then(res => {

                obj['ID'] = val.ID;
                obj['CEOapproval'] = val.Status;
                obj['Immapproval'] = val.Immediate_x0020_Head_x0020_Statu;
                obj['Created'] = val.Created;
                obj['CreatedMonth'] = val.MonthText;
                obj['CreatedYear'] = val.YearText;


                if (val.Immediate_x0020_Head_x0020_Statu === 'Approved') {
                    obj['CEOApprovalMonth'] = 'N/A';
                }
                if (val.Status === 'Approved') {
                    obj['CEOApprovalMonth'] = 'N/A';
                }
                if (!val.Status) {
                    obj['CEOApprovalMonth'] = 'N/A';
                    obj['CEOApprovalDate'] = 'N/A';
                    obj['PurchaserClosed'] = 'N/A'
                }

                var versionList = $(res.data).find('table.ms-settingsframe');
                var ceo_approval_date;
                var ceo_rejected_date;
                var imm_rejected_date;
                var close_date;

                if (typeof (versionList) !== typeof (undefined) && versionList !== null) {
                    versionList.find('tbody > tr').each(function (i, trval) {

                        if (i > 0) {

                            try {
                                var verRow = $(this);
                                var ceo_approval = verRow.find("table tr > td:contains(CEO Approval)").next().text();
                                var immhead_approval = verRow.find("table tr > td:contains(Immediate Head Status)").next().text();
                                var close = verRow.find("table tr > td:contains(Purchaser Status)").next().text();
                                var row = verRow.closest('tr');

                                if (!!ceo_approval) {
                                    var ceo_approval_trim = ceo_approval.trim();
                                    if (ceo_approval_trim === "Approved") {
                                        ceo_approval_date = row.prev().find('td:eq(1) > table > tbody > tr > td > a').html().trim();
                                        obj['CEOApprovalDate'] = ceo_approval_date;
                                    }
                                }

                                if (!!ceo_approval) {
                                    var ceo_rejected_trim = ceo_approval.trim();
                                    if (ceo_rejected_trim === "Rejected") {
                                        ceo_rejected_date = row.prev().find('td:eq(1) > table > tbody > tr > td > a').html().trim();
                                        obj['CEOApprovalDate'] = ceo_rejected_date;
                                        // obj['DatePORclosed'] = ceo_rejected_date;
                                        let dateCloseRejected_date = new Date(ceo_rejected_date).getMonth();
                                        let arr_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                        obj['CEOApprovalMonth'] = arr_month[dateCloseRejected_date];
                                    }
                                }

                                if (!!immhead_approval) {
                                    var imm_rejected_trim = immhead_approval.trim();
                                    if (imm_rejected_trim === "Rejected") {
                                        imm_rejected_date = row.prev().find('td:eq(1) > table > tbody > tr > td > a').html().trim();
                                        obj['CEOApprovalDate'] = imm_rejected_date;
                                        // obj['DatePORclosed'] = imm_rejected_date;
                                        let dateCloseRejected = new Date(imm_rejected_date).getMonth();
                                        let arr_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                        obj['CEOApprovalMonth'] = arr_month[dateCloseRejected];
                                    }
                                }

                                if (!!close) {
                                    var close_trim = close.trim();
                                    if (close_trim === "Closed") {
                                        close_date = row.prev().find('td:eq(1) > table > tbody > tr > td > a').html().trim();
                                        obj['PurchaserClosed'] = close_date;
                                        var dateClose_date = new Date(close_date).getMonth();
                                        let arr_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                        obj['PurchaserClosedMonth'] = arr_month[dateClose_date];
                                    }
                                }

                            } catch (error) {
                                console.log(error.message);
                            }
                        }
                    });
                }
                if (!!ceo_approval_date && !!close_date) {
                    var approval = new Date(ceo_approval_date);
                    var status_ = new Date(close_date);

                    function workingHoursBetweenDates(startDate, endDate) {
                        var minutesWorked = 0;

                        if (endDate < startDate) {
                            return 0;
                        }

                        var current = startDate;
                        var workHoursStart = 8;
                        var workHoursEnd = 17;
                        var includeWeekends = true;

                        while (current <= endDate) {
                            if (current.getHours() >= workHoursStart && current.getHours() < workHoursEnd && (includeWeekends ? current.getDay() !== 0 && current.getDay() !== 6 : true)) {
                                minutesWorked++;
                            }
                            current.setTime(current.getTime() + 1000 * 60);
                        }
                        return Math.round(minutesWorked / 60 * 100) / 100;
                    }
                    obj["Overdue"] = workingHoursBetweenDates(approval, status_).toFixed(2);
                }
                posts.push(obj);
            });
        });

        return Promise.all(requests).then(() => {
            return posts;
        });
    });
}



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++OLD APPROACH++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



// function pro(datares) {
//     return new Promise(function (resolve, reject) {
//         datares[0].map(e => {
//             axios.get(`${_spPageContextInfo.webAbsoluteUrl}/_layouts/15/versions.aspx?list={F4B955FE-AC03-4331-AAED-E7DA906376C8}&ID=${e}`).then(res => {
//                 resolve(res.data)
//             });
//         });
//     });
// }

// const PORSid = PORS.then(PORSdata => PORSdata);

// export const promises = Promise.all([PORSid])
//     .then(data => data[0].map(i => axios.get(`${_spPageContextInfo.webAbsoluteUrl}/_layouts/15/versions.aspx?list={F4B955FE-AC03-4331-AAED-E7DA906376C8}&ID=${i}`).then(res => pro(res))));







// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++OLD APPROACH++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// function getAllData(url) {
//     return axios.get(url, {
//         headers: {
//             "Accept": "application/json; odata=verbose"
//         }
//     }).then(response => response.data.d.results);
// }

// function getAllDataVHistory(data) {

//     return data.map(i => axios.get(`${_spPageContextInfo.webAbsoluteUrl}/_layouts/15/versions.aspx?list={F4B955FE-AC03-4331-AAED-E7DA906376C8}&ID=${i.ID}`).then(response => {
//         return response.data;
//     }));
// }


// export const final = () =>
//     getAllData(`${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbyTitle('Purchase Order Requests')/items?$top=12`)
//     .then(data => getAllDataVHistory(data));