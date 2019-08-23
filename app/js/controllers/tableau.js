banque.controller('tableauCTRL', ['$scope', '$rootScope','$interval', function ($scope, $rootScope,$interval) {
    console.log("entrer dans tableauCTRL");
    var periode = [];
    var element = [];
    var organisation = {};
    var data = [];

    $interval(function () {
        //console.log("entrer dans tableauCTRL");
        if($rootScope.tableauExecute){
            console.log("entrer dans tableauAffiche");
            $scope.tableauAffiche = true;
            initTableau();
            $rootScope.tableauExecute = false;
        }

    },10);

    function initTableau() {
        element = angular.copy($rootScope.DataElementSelected);
        organisation = angular.copy($rootScope.orgUnitSelect);
        data = angular.copy($rootScope.data.rows);
        $scope.lesPeriode = angular.copy($rootScope.periodeSelect);
        $scope.listElementData = [];
        initial();
    }


    function initial() {
        console.log("tableauCTRL initial() data = ", angular.copy(data),"/// data.length = ",data.length);
        for(var i =0;i<element.length;i++){
            var tmp = {};
            tmp.name = element[i].name;
            tmp.valeur = [];
            tmp.valeur = getElementValue(element[i].id);
            $scope.listElementData.push(tmp);
        }
    }

    function getElementValue(id) {
        console.log("tableauCTRL getElementValue() data = ", angular.copy(data),"/// data.length = ",data.length);
        var tableElement = [];
        var lesValeurs = [];
        var i = 0;
        while (i < data.length) {
            var ligne = [];
            ligne = data[i];
           // console.log("getElementValue() ligne = ", angular.copy(ligne));
            if (ligne.indexOf(id) != -1) {
               // console.log("getElementValue() trouver i = ",i);
                tableElement.push(ligne);
                data.splice(i,1);
               // console.log("getElementValue(), after splice data = ", angular.copy(data));
                i--;
            }
            i++;
        }
        console.log("tableauCTRL getElementValue() tableElement = ", angular.copy(tableElement));
        for (var l = 0; l < $scope.lesPeriode.length; l++) {
            var val = null;
            for (var k = 0; k < tableElement.length; k++) {
                var ligne = [];
                ligne = tableElement[k];
                for(var i = 0; i< ligne.length;i++){
                    if (ligne[i] == $scope.lesPeriode[l].id) {
                        var tpem = ligne.length - 1;
                        val = ligne[i + 1];
                        break;
                    }
                }

            }
            lesValeurs.push(val);
        }
        console.log("tableauCTRL getElementValue() lesValeurs = ", angular.copy(lesValeurs));
        return lesValeurs;
    }


}]);