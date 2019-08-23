banque.controller('graphiqueCTRL', ['$scope', '$rootScope','$interval', function ($scope, $rootScope,$interval) {
    console.log("entrer dans graphiqueCTRL");
    var periode = [];
    var element = [];
    var organisation = {};
    var data = [];
    var lesPeriode = [];
    var listElementData = [];
    var ykey = [];
    var labels = [];
    var dataconfig = {
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        pointFillColors:['#ffffff'],
        pointStrokeColors: ['black'],
        lineColors:['gray','red'],
        element: 'barBanq'
    };
    $interval(function () {
        //console.log("entrer dans graphiqueCTRL");
        if($rootScope.graphiqueExecute){
            console.log("graphiqueCTRL $interval");
            $rootScope.graphiqueExecute = false;
            $scope.tableauAffiche = true;
            initgraphique();

        }

    },15);

    function initgraphique() {

        element = angular.copy($rootScope.DataElementSelected);
        organisation = angular.copy($rootScope.orgUnitSelect);
        data = angular.copy($rootScope.data.rows);
        lesPeriode = angular.copy($rootScope.periodeSelect);
        listElementData = [];
        console.log("element = ",element);
        console.log("organisation = ",organisation);
        console.log("lesPeriode = ",lesPeriode);
        console.log("data = ",data);
        initial();
    }


    function initial() {
        console.log("initial() data = ", angular.copy(data),"/// data.length = ",data.length);
        for(var i =0;i<lesPeriode.length;i++){
            var tmp = {};
            ykey = [];
            labels = [];
            tmp.period = lesPeriode[i].name;
            for(var j=0;j<element.length;j++){
                ykey.push(element[j].id);
                labels.push(element[j].name);
                tmp[element[j].id] = getElementValue(lesPeriode[i].id,element[j].id);
            }
            listElementData.push(tmp);
        }
        console.log("initial() listElementData = ", angular.copy(listElementData)," /// ykey = ",ykey," /// labels = ",labels);
        configuration();
    }

    function getElementValue(periode,element) {
        //console.log("getElementValue() data = ", angular.copy(data));
        var i = 0;
        while (i < data.length) {
            var ligne = [];
            ligne = data[i];
            //console.log("getElementValue() ligne = ", angular.copy(ligne));
            if(ligne[0] == element && ligne[1] == periode){
                return Number(ligne[2]);

            }
            i++;
        }

    }

    function configuration() {
        dataconfig.data = listElementData;
        dataconfig.xkey = 'period';
        dataconfig.ykeys = ykey;
        dataconfig.labels = labels;
        if($rootScope.typeGraph == 'barre'){
            //dataconfig.element = 'bar-banq';
            //Morris.Bar(dataconfig);
            Morris.Bar({
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors:['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors:['gray','red'],
                element: 'barBanq',
                data: listElementData,
                xkey: 'period',
                ykeys: ykey,
                labels: labels
            });
        }
        if($rootScope.typeGraph == 'line'){
            //dataconfig.element = 'lineChart';
            Morris.Line({
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors:['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors:['gray','red'],
                element: 'barBanq',
                data: listElementData,
                xkey: 'period',
                ykeys: ykey,
                labels: labels
            });
        }

    }

    var data = [
            { y: '2014', a: 50, b: 90},
            { y: '2015', a: 65,  b: 75},
            { y: '2016', a: 50,  b: 50},
            { y: '2017', a: 75,  b: 60},
            { y: '2018', a: 80,  b: 65},
            { y: '2019', a: 90,  b: 70},
            { y: '2020', a: 100, b: 75},
            { y: '2021', a: 115, b: 75},
            { y: '2022', a: 120, b: 85},
            { y: '2023', a: 145, b: 85},
            { y: '2024', a: 160, b: 95}
        ],
        config = {
            data: data,
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Total Income', 'Total Outcome'],
            fillOpacity: 0.6,
            hideHover: 'auto',
            behaveLikeLine: true,
            resize: true,
            pointFillColors:['#ffffff'],
            pointStrokeColors: ['black'],
            lineColors:['gray','red']
        };
    /*config.element = 'area-chart';
    Morris.Area(config);
    config.element = 'line-chart';
    Morris.Line(config);
    config.element = 'lineChart';
    Morris.Line(config);
    //config.element = 'bar-chart';
    //Morris.Bar(config);
    config.element = 'stacked';
    config.stacked = true;
    Morris.Bar(config);
    Morris.Donut({
        element: 'pie-chart',
        data: [
            {label: "Friends", value: 30},
            {label: "Allies", value: 15},
            {label: "Enemies", value: 45},
            {label: "Neutral", value: 10}
        ]
    });*/

}]);