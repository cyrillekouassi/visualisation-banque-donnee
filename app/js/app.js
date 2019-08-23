//var baseUrl = "https://play.dhis2.org/2.28";
//var login = "admin:district";
var baseUrl = "https://sigsante.gouv.ci/dhis";
var login = "cyrille kouassi:Rylco2016#";
var auth = window.btoa(login);

var banque = angular.module('banqueDonnee', ['ui.router', 'ngResource', 'tree_directive','chart.js']);
banque.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;

    /*var tableau = {
        name: 'tableau',
        url: '/tableau',
        templateUrl: 'views/tableau.html',
        controller: 'tableauCTRL'
    };
    var accueil = {
        name: 'accueil',
        url: '/accueil',
        templateUrl: 'views/accueil.html'
        // controller: 'accueilCTRL'
    };
    /*var enrol = {
        name: 'enrolement',
        url: '/enrolement',
        templateUrl: 'views/enrolement.html',
        controller: 'enrolementCTRL'
    };*
    $stateProvider.state(tableau);
    $stateProvider.state(accueil);*/

}]);

banque.run(['$rootScope','analytics','$state','$filter','indicateursResource', '$http','dataElementsResource', 'meResource', 'orgUnitResource', '$location', '$window','$timeout', function ($rootScope,analytics,$state,$filter,indicateursResource, $http,dataElementsResource, meResource, orgUnitResource, $location, $window,$timeout) {

    var meUrl = baseUrl + '/api/me/';
    var analyticUrl = baseUrl + "/api/analytics?";
    var elementDim = "dimension=dx:";
    var periodeDim = "dimension=pe:";
    var orgDim = "dimension=ou:";
    var orgFilter = "filter=ou:";
    var analyticData = "";
    var orgUnitCollection = [], arrylong = 0, listeCode = [], page = 1, pageCount = 0;
    var allOrgUnit = [];
    var meDataView = [];
    $rootScope.arbre = [];
    $rootScope.TypeData = [{id: 'indicator', name:"Indicateurs"},{id:'dataElement',name:'Elements de données'}];
    $rootScope.patientez = false;
    $rootScope.nbreTelecharger = 0;
    $rootScope.nbreTotal = 0;
    $rootScope.loadingOrgUnits = false;

    $rootScope.ListDataElement = [];
    $rootScope.DataElementSelected = [];
    $rootScope.periodeSelect = [];
    $rootScope.ListPeriode = [];
    $rootScope.orgUnitSelect = {};
    $rootScope.data = [];
    $rootScope.presentation = "tableau";
    $rootScope.typeGraph = 'barre';

    var mois = [{code: "01",name: "Janvier"},{code: "02",name: "Février"},{code: "03",name: "Mars"},{code: "04",name: "Avril"},
        {code: "05",name: "Mai"},{code: "06",name: "Juin"},{code: "07",name: "Juillet"},{code: "08",name: "Août"},
        {code: "09",name: "Septembre"},{code: "10",name: "Octobre"},{code: "11",name: "Novembre"},{code: "12",name: "Décembre"}];

    var Trimestre = [{code: "Q1",name: "Janvier - Mars"},{code: "Q2",name: "Avril - Juin"},
        {code: "Q3",name: "Juillet - Septembre"},{code: "Q4",name: "Octobre - Décembre"}];

    var Semestre = [{code: "S1",name: "Janvier - Juin"},{code: "S2",name: "Juillet - Décembre"}];

    $rootScope.typePeriode = [{id: "mois",name:"Mensuel"},{id: "trimestre",name: "Trimestriel"},{id: "semestre", name: "Semestriel"},{id:"an",name:"Annuel"}];

    $rootScope.laperiode = "mois";

    $rootScope.annee = $filter('date')(new Date(), "yyyy");
    getPeriode(mois,$rootScope.annee );
    $rootScope.annee = parseInt($rootScope.annee , 10);
    var lan = angular.copy($rootScope.annee);

    getMe();

    function getMe() {
        console.log("Entrer dans getMe");
        $http.get(meUrl).then(function (succes) {
            console.log("saveData() succes = ", succes);
            meDataView = succes.data.dataViewOrganisationUnits;
            getOrgUnit();
        }, function (error) {
            console.log("getMe() error = ", error);
        });
    }

    function getOrgUnit() {
        console.log("Entrer dans getOrgUnit");
        orgUnitResource.query({
            paging: false,
            fields: 'id,name,parent,code,description,children,level'
        }, function (data) {
            console.log("data = ", data);
            allOrgUnit = data.organisationUnits;
            dataArbre();
        }, function (err) {
            console.log("echec de collection de tout en une fois");
            getOrgUnitDetail();
        });
    }

    function getOrgUnitDetail() {
        console.log("entrer dans getOrgUnitDetail()");
        $rootScope.patientez = true;
        orgUnitResource.query({
            pageSize: 300,
            fields: 'id,name,parent,code,description,children,level'
        }, function (data) {
            //console.log("resultat positif getOrgUnitDetail");
            //console.log(data);
            $rootScope.allOrgUnit = [];
            if (data.pager.pageCount) {
                page = 1;
                pageCount = data.pager.pageCount;
                //console.log("pageCount = "+pageCount);
                allOrgUnit = data.organisationUnits;
                $rootScope.nbreTelecharger = 1;
                $rootScope.nbreTotal = pageCount;
                if (pageCount > page) {
                    page++;
                    getOrgUnitID();
                }
            }
            //getOrgUnitID();
        }, function (err) {

        });

    }

    function getOrgUnitID() {
        console.log("entrer dans getOrgUnitID()");
        orgUnitResource.query({
            page: page,
            pageSize: 300,
            fields: 'id,name,parent,code,description,children,level'
        }, function (data) {
            var tempo = [];
            tempo = angular.copy(allOrgUnit);
            allOrgUnit = tempo.concat(data.organisationUnits);
            if (pageCount > page) {
                page++;
                $rootScope.nbreTelecharger++;
                getOrgUnitID();
            } else {
                console.log("fin de collect orgUnits dans getOrgUnitID()");
                //console.log($rootScope.allOrgUnit);
                dataArbre();
            }
        }, function (err) {

        });
    }

    function getOrgLevelOne() {
        for (var i = 0; i < allOrgUnit.length; i++) {
            if (allOrgUnit[i].level == 1) {
                meDataView.push({id: allOrgUnit[i].id});
            }
        }
    }

    function dataArbre() {
        //console.log("meDataView = ", meDataView);
        if (meDataView.length == 0) {
            getOrgLevelOne();
        }
        //console.log("meDataView = ", angular.copy(meDataView));
        var a = 0, b = meDataView.length;
        while (a < b) {
            for (var i = 0, j = allOrgUnit.length; i < j; i++) {
                if (meDataView[a].id === allOrgUnit[i].id) {
                    meDataView[a] = allOrgUnit[i];
                    //meDataView[a].children = allOrgUnit[i].childrens;
                    //delete meDataView[a].childrens;
                    if (meDataView[a].children.length > 0) {
                        meDataView[a].collapse = true;
                        meDataView[a].children = getChildren(meDataView[a].children);
                        meDataView[a].children = ordreName(meDataView[a].children)
                    }
                    break;
                }
            }
            a++;
        }
        //console.log("entrer meDataView = ", angular.copy(meDataView));
        $rootScope.arbre = meDataView;

    }

    function ordreName(orgUnitCollec) {
        //console.log("entrer orgUnitCollec = ", angular.copy(orgUnitCollec));
        orgUnitCollec.sort(function (a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
        return orgUnitCollec;
        //console.log("sortir orgUnitCollec = ", angular.copy(orgUnitCollec));
    }

    function getChildren(child) {
        //console.log("getChildren");
        var a = 0, b = child.length;
        while (a < b) {
            for (var i = 0, j = allOrgUnit.length; i < j; i++) {
                if (child[a].id === allOrgUnit[i].id) {
                    child[a] = allOrgUnit[i];
                    //child[a].children = allOrgUnit[i].childrens;
                    //delete child[a].childrens;
                    if (child[a].children.length > 0) {
                        child[a].children = getChildren(child[a].children);
                        child[a].children = ordreName(child[a].children)
                    }
                    break;
                }
            }
            a++;
        }
        return child;
    }

    function getElement(){

        dataElementsResource.query({
            fields: 'id,name,shortName'
        }, function (data) {
           // console.log("getElement() data = ", data);
            $rootScope.ListDataElement = data.dataElements;
            for(var i =0;i<$rootScope.ListDataElement.length;i++){
                $rootScope.ListDataElement[i].type = "dataElement";
            }
        }, function (err) {
            console.log("echec getElement() ,err = ",err);

        });
    }

    function getIndateur(){

        indicateursResource.query({
            fields: 'id,name,shortName'
        }, function (data) {
            //console.log("getIndateur() data = ", data);
            $rootScope.ListDataElement = data.indicators;
            for(var i =0;i<$rootScope.ListDataElement.length;i++){
                $rootScope.ListDataElement[i].type = "indicator";
            }

        }, function (err) {
            console.log("echec getIndateur() ,err = ",err);

        });
    }


    $rootScope.choisirType = function (type) {
        //console.log("type = ",type);
        if(type == "indicator"){
            getIndateur();
        }
        if(type == "dataElement"){
            getElement();
        }
    };
    
    $rootScope.dataSelected = function (element, index) {
        $rootScope.DataElementSelected.push(element);
        $rootScope.ListDataElement.splice(index,1);

    };

    $rootScope.deleteSelected = function (element, index) {
        if($rootScope.type == element.type){
            $rootScope.ListDataElement.push(element);
        }
        $rootScope.DataElementSelected.splice(index,1);
    };

    function getPeriode(type,year) {
        $rootScope.ListPeriode = [];
        for(var i =0;i<type.length;i++){
            var tmp = {};
            tmp.id = year+type[i].code;
            tmp.name = type[i].name+" "+year;
            $rootScope.ListPeriode.push(tmp);
        }
        console.log("getPeriode(); $rootScope.ListPeriode = ",$rootScope.ListPeriode);
    }
    $rootScope.periodeSelected = function (id, year) {
        $rootScope.periodeSelect = [];
        lan = year;
        changePeriode(id, year);
    };
    
    $rootScope.anneePreced = function () {
        lan--;
        changePeriode($rootScope.laperiode,lan);
    };
    $rootScope.anneeSuivant = function () {
        lan++;
        changePeriode($rootScope.laperiode,lan);
    };

    $rootScope.periodeSelectionner = function (periode,index) {
        $rootScope.periodeSelect.push(periode);
        $rootScope.ListPeriode.splice(index,1);
    };

    $rootScope.deletePeriode = function (periode,index) {
        $rootScope.ListPeriode.push(periode);
        $rootScope.periodeSelect.splice(index,1);
    };

    function changePeriode(id, year) {
        if(id == "mois"){
            getPeriode(mois,year);
        }
        if(id == "trimestre"){
            getPeriode(Trimestre,year);
        }
        if(id == "semestre"){
            getPeriode(Semestre,year);
        }
        if(id == "an"){
            $rootScope.ListPeriode = [];
            var tmp = {};
            tmp.id = year;
            tmp.name = year;
            $rootScope.ListPeriode.push(tmp);
        }
    }

    $rootScope.toutes_les_donnees = function (lesSelects) {
        console.log("entrer dans $rootScope.toutes_les_données");
        console.log(lesSelects);
        $rootScope.orgUnitSelect = lesSelects;
    };

    $rootScope.visualiser = function () {
        console.log("visualiser()");
        var lesElementDim = elementDim + getElementId();
        var lesPeriodeDim = periodeDim + getPeriodeId();
        var organisation = orgFilter + $rootScope.orgUnitSelect.id;
        analyticData = analyticUrl+lesElementDim+"&"+lesPeriodeDim+"&"+organisation;
        getdata();
        /*$http.get(meUrl).then(function (succes) {
            console.log("visualiser() succes = ", succes);
            getdata();
        }, function (error) {
            console.log("visualiser() error = ", error);
        });*/
    };

    function getdata(){
        console.log("getdata(), analyticData = ",analyticData);
        var header = {"Authorization": "Basic " + auth};
        $http.get(analyticData,{headers: header}).then(function (succes) {
            console.log("getdata() succes = ", succes);
            $rootScope.data = succes.data;
            gotoView();
        }, function (error) {
            console.log("getdata() error = ", error);
        });


    }

    $rootScope.typePresentation = function (type) {
        //console.log("typePresentation(), type = ",type);
        $rootScope.presentation = type;
        //$state.go(type);

    };

    function getElementId() {
        var element = null;
        for(var i =0;i<$rootScope.DataElementSelected.length;i++){
            if(!element){
                element = $rootScope.DataElementSelected[i].id;
            }else{
                element = element+";"+$rootScope.DataElementSelected[i].id;
            }
        }
        return element;
    }

    function getPeriodeId() {
        var periode = null;
        for(var i =0;i<$rootScope.periodeSelect.length;i++){
            if(!periode){
                periode = $rootScope.periodeSelect[i].id;
            }else{
                periode = periode+";"+$rootScope.periodeSelect[i].id;
            }
        }
        return periode;
    }

    function gotoView() {
        console.log("gotoView()");
        console.log("gotoView() $rootScope.presentation = ",$rootScope.presentation);

        if($rootScope.presentation == "tableau"){
            $rootScope.tableauExecute = true;
        }
        if($rootScope.presentation == "graphique"){
            $rootScope.graphiqueExecute = true;
        }
    }
    $rootScope.selectionGraphique = function (type) {
        console.log("selectionGraphique()");
        $rootScope.typeGraph = type;
    }
}]);
