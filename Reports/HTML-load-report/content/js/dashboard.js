/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4690265486725664, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get Contact List 2"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 3"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 1"], "isController": false}, {"data": [0.1, 500, 1500, "Get Contact List 6"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact By ID 9"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 7"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 4"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 5"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact By ID 6"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact By ID 7"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact By ID 8"], "isController": false}, {"data": [0.5, 500, 1500, "Login Apps 1"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact By ID 2"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact By ID 3"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PATCH) Contact By ID 9"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PATCH) Contact By ID 8"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PATCH) Contact By ID 7"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PATCH) Contact By ID 6"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PATCH) Contact By ID 3"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PATCH) Contact By ID 2"], "isController": false}, {"data": [0.5, 500, 1500, "Update and Delete Contact by ID"], "isController": true}, {"data": [0.0, 500, 1500, "Get Contact List 10"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact 8"], "isController": false}, {"data": [1.0, 500, 1500, "Get Contact By ID 8"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact 7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Add Contact 9"], "isController": false}, {"data": [0.5, 500, 1500, "Add Contact 3"], "isController": false}, {"data": [0.5, 500, 1500, "Add Contact 6"], "isController": false}, {"data": [1.0, 500, 1500, "Add Contact 2"], "isController": false}, {"data": [0.75, 500, 1500, "Create and Get Contact by ID"], "isController": true}, {"data": [1.0, 500, 1500, "Update (PUT) Contact By ID 9"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PUT) Contact By ID 6"], "isController": false}, {"data": [1.0, 500, 1500, "Get Contact By ID 3"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 8"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PUT) Contact By ID 7"], "isController": false}, {"data": [0.0, 500, 1500, "Get Contact List 9"], "isController": false}, {"data": [0.75, 500, 1500, "Update (PUT) Contact By ID 8"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PUT) Contact By ID 2"], "isController": false}, {"data": [1.0, 500, 1500, "Update (PUT) Contact By ID 3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 93, 0, 0.0, 1607.301075268817, 281, 6268, 1763.0, 3155.0, 3423.9999999999995, 6268.0, 3.454680534918276, 1573.1287147102526, 1.5323179791976225], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Contact List 2", 5, 0, 0.0, 2337.2, 1704, 3137, 2054.0, 3137.0, 3137.0, 3137.0, 0.4127455836222552, 349.1885679791976, 0.1455089411012052], "isController": false}, {"data": ["Get Contact List 3", 5, 0, 0.0, 2590.8, 2091, 3206, 2640.0, 3206.0, 3206.0, 3206.0, 0.31776294884016526, 268.8917520654592, 0.11202385208134732], "isController": false}, {"data": ["Get Contact List 1", 5, 0, 0.0, 2420.4, 1981, 3140, 2334.0, 3140.0, 3140.0, 3140.0, 0.4129842240026431, 349.3928002653424, 0.1455930711571818], "isController": false}, {"data": ["Get Contact List 6", 5, 0, 0.0, 2437.2, 1433, 3361, 2258.0, 3361.0, 3361.0, 3361.0, 0.380430647492962, 321.9439679154303, 0.13411666381343681], "isController": false}, {"data": ["Delete Contact By ID 9", 3, 0, 0.0, 410.0, 319, 497, 414.0, 497.0, 497.0, 497.0, 0.3834845967020325, 0.2831194874089224, 0.15279464399846607], "isController": false}, {"data": ["Get Contact List 7", 5, 0, 0.0, 3463.8, 2059, 6268, 3086.0, 6268.0, 6268.0, 6268.0, 0.2834467120181406, 239.81728759212018, 0.09992603812358276], "isController": false}, {"data": ["Get Contact List 4", 5, 0, 0.0, 2278.8, 1763, 3379, 1995.0, 3379.0, 3379.0, 3379.0, 0.4386349679796473, 371.20340874199496, 0.1546359603912624], "isController": false}, {"data": ["Get Contact List 5", 5, 0, 0.0, 2833.2, 1948, 3587, 2784.0, 3587.0, 3587.0, 3587.0, 0.3528830545557203, 298.5667709877197, 0.12440506122520996], "isController": false}, {"data": ["Delete Contact By ID 6", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 2.361056170886076, 1.260878164556962], "isController": false}, {"data": ["Delete Contact By ID 7", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 2.2596153846153846, 1.2259615384615383], "isController": false}, {"data": ["Delete Contact By ID 8", 2, 0, 0.0, 317.5, 316, 319, 317.5, 319.0, 319.0, 319.0, 0.39300451955197485, 0.29398580271173114, 0.16656636863823931], "isController": false}, {"data": ["Login Apps 1", 1, 0, 0.0, 1211.0, 1211, 1211, 1211.0, 1211.0, 1211.0, 1211.0, 0.8257638315441783, 1.0152701796036332, 0.23869735755573904], "isController": false}, {"data": ["Delete Contact By ID 2", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.4941934121621623, 1.3460726351351353], "isController": false}, {"data": ["Delete Contact By ID 3", 2, 0, 0.0, 282.0, 281, 283, 282.0, 283.0, 283.0, 283.0, 0.4884004884004884, 0.3605769230769231, 0.20699786324786326], "isController": false}, {"data": ["Update (PATCH) Contact By ID 9", 3, 0, 0.0, 376.0, 312, 472, 344.0, 472.0, 472.0, 472.0, 0.3822142948146261, 0.40460966365142054, 0.1672187539813989], "isController": false}, {"data": ["Update (PATCH) Contact By ID 8", 2, 0, 0.0, 323.5, 320, 327, 323.5, 327.0, 327.0, 327.0, 0.3927729772191674, 0.4173212882953653, 0.18181092890809114], "isController": false}, {"data": ["Update (PATCH) Contact By ID 7", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 3.186367069486405, 1.3217522658610272], "isController": false}, {"data": ["Update (PATCH) Contact By ID 6", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 3.414818548387097, 1.4112903225806452], "isController": false}, {"data": ["Update (PATCH) Contact By ID 3", 2, 0, 0.0, 295.5, 286, 305, 295.5, 305.0, 305.0, 305.0, 0.48555474629764506, 0.5140052197135228, 0.22475873998543336], "isController": false}, {"data": ["Update (PATCH) Contact By ID 2", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 3.5642887205387206, 1.4730639730639732], "isController": false}, {"data": ["Update and Delete Contact by ID", 10, 0, 0.0, 1034.6, 853, 1279, 1015.0, 1276.7, 1279.0, 1279.0, 0.5354465624330692, 1.5265455999678734, 0.8466748768472907], "isController": true}, {"data": ["Get Contact List 10", 5, 0, 0.0, 2362.4, 1937, 3014, 2278.0, 3014.0, 3014.0, 3014.0, 0.4231908590774439, 358.10468353258574, 0.1491913087177317], "isController": false}, {"data": ["Add Contact 8", 2, 0, 0.0, 351.5, 324, 379, 351.5, 379.0, 379.0, 379.0, 0.5056890012642224, 0.5269239886219974, 0.34222898230088494], "isController": false}, {"data": ["Get Contact By ID 8", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 2.6570431472081215, 0.9567338197969543], "isController": false}, {"data": ["Add Contact 7", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 3.2769097222222223, 2.1484375], "isController": false}, {"data": ["Add Contact 9", 3, 0, 0.0, 622.3333333333334, 326, 1195, 346.0, 1195.0, 1195.0, 1195.0, 0.32537960954446854, 0.33756016133405636, 0.22020319278741865], "isController": false}, {"data": ["Add Contact 3", 2, 0, 0.0, 857.0, 567, 1147, 857.0, 1147.0, 1147.0, 1147.0, 0.3594536304816679, 0.3731437589863408, 0.24326305265995687], "isController": false}, {"data": ["Add Contact 6", 1, 0, 0.0, 1156.0, 1156, 1156, 1156.0, 1156.0, 1156.0, 1156.0, 0.8650519031141869, 0.89630866133218, 0.5854306336505191], "isController": false}, {"data": ["Add Contact 2", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 2.4494865543735225, 1.5999002659574468], "isController": false}, {"data": ["Create and Get Contact by ID", 10, 0, 0.0, 686.9, 315, 1195, 598.0, 1191.1, 1195.0, 1195.0, 0.5107513151846366, 0.6363442655396088, 0.3841608036671944], "isController": true}, {"data": ["Update (PUT) Contact By ID 9", 3, 0, 0.0, 349.0, 310, 426, 311.0, 426.0, 426.0, 426.0, 0.382262996941896, 0.40254583174057085, 0.2732583142201835], "isController": false}, {"data": ["Update (PUT) Contact By ID 6", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 3.1946693978658534, 2.179401676829268], "isController": false}, {"data": ["Get Contact By ID 3", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 3.485374579124579, 1.2692024410774412], "isController": false}, {"data": ["Get Contact List 8", 5, 0, 0.0, 3015.0, 2292, 4687, 2737.0, 4687.0, 4687.0, 4687.0, 0.27182776992497554, 229.9895473727846, 0.09582990717081658], "isController": false}, {"data": ["Update (PUT) Contact By ID 7", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 3.331982114779874, 2.247936320754717], "isController": false}, {"data": ["Get Contact List 9", 5, 0, 0.0, 2471.8, 1746, 3529, 2348.0, 3529.0, 3529.0, 3529.0, 0.3041177543945015, 257.30702302931695, 0.10721338802384284], "isController": false}, {"data": ["Update (PUT) Contact By ID 8", 2, 0, 0.0, 466.0, 319, 613, 466.0, 613.0, 613.0, 613.0, 0.3933910306845004, 0.4137520898898505, 0.29120156372934697], "isController": false}, {"data": ["Update (PUT) Contact By ID 2", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 3.528119739057239, 2.406881313131313], "isController": false}, {"data": ["Update (PUT) Contact By ID 3", 2, 0, 0.0, 377.0, 286, 468, 377.0, 468.0, 468.0, 468.0, 0.4650081376424087, 0.48725950360381304, 0.3442150081376424], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 93, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
