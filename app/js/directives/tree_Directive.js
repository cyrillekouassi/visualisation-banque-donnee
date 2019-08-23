
var module = angular.module('tree_directive', []);
module.directive('orgTree',[ function () {
    return {
        restrict: 'E',
        replace: true,
        template:"<ul class='treeRoot'><li ng-repeat='row in treeArbre | filter:{visible:true} track by $index' class='treeitem'><span ng-style='row.magin'><i ng-if='row.expand' ng-class=\"row.collapse ? 'icon-collapse-alt':'icon-expand-alt'\" ng-click='expanded(row)'></i><i ng-if='multiSelect' ng-click='element_select(row,\"icon\")' ng-class='row.icon'></i><span ng-class='{textColor: row.selected}' class='text' ng-click='element_select(row,\"org\")'>{{row.name}}</span></span></li></ul>",
        scope: {
            orgData: '=',
            multiSelect: '=',
            getAllselect: '&'
            
        },
        link: function(scope, element, attrs) {
            //console.log("entrer dans directive");
            var index = 0, allSelectofTree = [], lesSelects = [],OrgUnique = {},oldOrg = {}, dataCopy = [];
            var orgCollapse = [];
            var lesCheckBox = ["icon-check-empty","icon-check","icon-check-sign","icon-check-empty"];
            /*ng-class=\"{'icon-check-empty' : click, 'icon-check' :!click, 'icon-check-sign' :!click}\"*/
            //console.log(lesCheckBox);

            scope.$watch('orgData', on_change, true);
            
            function on_change() {
                if(angular.isArray(scope.orgData)){
                    //scope.treeArbre = scope.orgData;
                    scope.treeArbre = [];
                    contitArbre();
                }
            }

            function contitArbre() {
                dataCopy = angular.copy(scope.orgData);
                var a= 0, b = dataCopy.length, niveau = 1;
                //console.log("scope.multiSelect = "+scope.multiSelect);
                while(a < b){
                    var temp = {};
                    temp.index = index;
                    index++;
                    temp.name = dataCopy[a].name;
                    temp.data = angular.copy(dataCopy[a]);
                    delete temp.data.children;
                    temp.selected = false;
                    temp.ui = ""+niveau;
                    dataCopy[a].ui = temp.ui;
                    temp.icon = 'icon-check-empty';
                    temp.visible = true;
                    temp.posit = 0;
                    temp.level = niveau;
                    temp.magin = {'margin-left': temp.posit};
                    //data[a].level = niveau;
                    //console.log(scope.orgData);
                    if(dataCopy[a].children && angular.isArray(dataCopy[a].children) && dataCopy[a].children.length >0){
                        temp.expand = true;
                        if(dataCopy[a].collapse){
                            temp.collapse = true;
                            orgCollapse.push(temp);
                        }else{
                            temp.collapse = false;
                        }
                        scope.treeArbre.push(temp);
                        addChild(dataCopy[a].children, temp.ui,temp.posit,temp.level,temp.collapse);
                    }else{
                        temp.expand = false;
                        scope.treeArbre.push(temp);
                    }
                    a++;niveau++;
                }
                /*console.log("scope.treeArbre");
                console.log(scope.treeArbre);
                console.log("dataCopy");
                console.log(dataCopy);*/
            }
            
            function addChild(data, niveau, posit,level, collapse) {
                var a= 0, b = data.length, code = 1;
                while(a < b){
                    var temp = {};
                    temp.index = index;
                    index++;
                    temp.name = data[a].name;
                    temp.data = angular.copy(data[a]);
                    delete temp.data.children;
                    temp.selected = false;
                    temp.ui = niveau+""+code;
                    data[a].ui = temp.ui;
                    temp.icon = 'icon-check-empty';
                    temp.visible = collapse;
                    temp.level = level+1;
                    temp.magin = {'margin-left': temp.posit};
                    //console.log(data);
                    if(data[a].children && angular.isArray(data[a].children) && data[a].children.length >0){
                        temp.expand = true;
                        //if(!scope.multiSelect){
                          //  temp.posit = 5+posit;
                        //}else{
                            temp.posit = 20+posit;
                        //}
                        temp.magin = {'margin-left': temp.posit};
                        if(data[a].collapse){
                            temp.collapse = true;
                            orgCollapse.push(temp);
                        }else{
                            temp.collapse = false;
                        }
                        scope.treeArbre.push(temp);
                        addChild(data[a].children, temp.ui,temp.posit,temp.level,temp.collapse);
                    }else{
                        //if(!scope.multiSelect){
                        //    temp.posit = 20+posit;
                        //}else{
                            temp.posit = 40+posit;
                        //}
                        temp.magin = {'margin-left': temp.posit};
                        scope.treeArbre.push(temp);
                    }
                    a++;code++;
                }
            }
            
            scope.expanded = function (org) {
                //console.log("entrer dans scope.expanded");
                //console.log(index);
                //console.log(scope.treeArbre[index]);
                //console.log(treeCopy[index]);
                //var org = treeCopy[index];
                //console.log("org.collapse = "+angular.copy(org.collapse));
                if(!org.collapse){
                    org.collapse = true;
                    affiche(org);
                }else{
                    org.collapse = false;
                    cache(org);
                }
            }

            function cache(org) {
                //console.log("entrer dans cache");
                var codeParent = org.ui; var actives = [];
                for(var i = org.index+1, j=scope.treeArbre.length;i<j;i++){
                    var child = scope.treeArbre[i];
                    var codeChild = child.ui;
                    if(codeChild.indexOf(codeParent) == 0){
                       // console.log("i = "+i);
                        if(child.visible){
                            actives.push(child.index);
                            child.visible = false;
                        }

                    }else{
                        break;
                    }
                }
                org.actives = actives;
            }

            function affiche(org) {

                for(var i = org.index+1, j=scope.treeArbre.length;i<j;i++){
                    var child = scope.treeArbre[i];
                    if(org.level < child.level){
                        if(org.level+1 == child.level){
                            child.visible = true;
                        }else{
                            if(org.actives && org.actives.indexOf(child.index) != -1){
                                //console.log("appartient au parents");
                                //console.log(org.actives)
                                child.visible = true;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }

            scope.element_select = function (org,element) {
                if(element == "org"){
                    selectOrg(org);
                }else{
                    checkedIcon(org);
                }
            }

            function selectOrg(org) {
                //console.log("scope.multiSelect = "+scope.multiSelect);
                if(!scope.multiSelect){
                    //console.log("le multiSelect desactivé------");
                    //console.log("org.index = "+org.index+" oldOrg.index = "+oldOrg.index);
                    if(org.index != oldOrg.index){
                        org.selected = true;
                        addOrgUnitOnly(org);
                    }
                    
                }else {
                    //console.log("le multiSelect activé++++++++")
                    org.selected = !org.selected;
                    if(org.selected){
                        org.icon = 'icon-check';
                        addOrgUnit(org);

                    }else{
                        org.icon = 'icon-check-empty';
                        changeParentIcon(org);
                        deleteOrgUnit(org);
                    }
                }
                
            }
            
            function changeParentIcon(org) {
                //console.log("entrer dans changeParentIcon");
                for(var i = org.index; i > -1; i--){
                    //console.log("i = "+i);
                    var arriere = scope.treeArbre[i];
                    if(arriere.level < org.level){
                        //console.log("trouvééééé");
                        if(arriere.icon == 'icon-check-sign'){
                            arriere.icon = 'icon-check';
                        }
                    }
                }
            }
            
            function checkedIcon(org) {
                //for(var i = 0,j=)
                var indice = lesCheckBox.indexOf(org.icon);
                org.icon = lesCheckBox[indice+1];
                if(org.icon == "icon-check-sign"){
                    selectall(org);
                }else if(org.icon == "icon-check"){
                    selectOne(org);
                }else{
                    deselect(org,true);
                }

            }
            

            function selectall(org) {
                //console.log("entrer dans selectall");
                //console.log(org);
                if(scope.treeArbre[org.index+1].level == org.level){
                    org.icon = "icon-check-empty";
                    deselect(org,false);
                    changeParentIcon(org);
                }else{
                    org.selected = true;
                    var selected = [];
                    selected.push(org);
                    for(var i = org.index+1,j=scope.treeArbre.length;i<j;i++){
                        //console.log("i "+i+"// j = "+j);
                        var child = scope.treeArbre[i];
                        //console.log(child);
                        if(child.level > org.level){
                            //console.log("appartient !!!!!!!");
                            child.selected = true;
                            child.icon = "icon-check";
                            if(j != i+1){
                                if(child.level < scope.treeArbre[i+1].level){
                                    child.icon = "icon-check-sign";
                                }
                            }
                            selected.push(child);
                        }else{
                            break;
                        }
                    }
                    addOrgUnit(selected);

                }
                
            }

            function selectOne(org){
                org.selected = true;
                addOrgUnit(org);
            }

            function deselect(org,Parent) {
                var selected = [];
                org.selected = false;
                selected.push(org);
                
                if(Parent){
                    for(var i = org.index+1,j=scope.treeArbre.length;i<j;i++){
                        //console.log("i "+i+"// j = "+j);
                        var child = scope.treeArbre[i];
                        //console.log(child);
                        if(child.level > org.level){
                            //console.log("appartient !!!!!!!");
                            child.selected = false;
                            child.icon = "icon-check-empty";
                            selected.push(child)
                        }else{
                            break;
                        }
                    }
                }
                deleteOrgUnit(selected);
            }

            function addOrgUnit(selected) {
                //console.log("entrer dans addOrgUnit");
                if(angular.isArray(selected)){
                    for(var i = 0,j=selected.length;i<j;i++){
                        var indice = allSelectofTree.map(function(e) { return e.index; }).indexOf(selected[i].index);
                        //console.log(indice);
                        if(indice == -1){
                            allSelectofTree.push(selected[i]);
                        }
                    }

                }else{
                    var indice = allSelectofTree.map(function(e) { return e.index; }).indexOf(selected.index);
                    //console.log(indice);
                    if(indice == -1){
                        allSelectofTree.push(selected);
                    }
                }
                /*console.log("allSelectofTree");
                console.log(allSelectofTree);*/
                arrangement();
            }

            function deleteOrgUnit(selected) {
                //console.log("entrer dans deleteOrgUnit");
                if(angular.isArray(selected)){
                    for(var i =0,j=selected.length;i<j;i++){
                        var indice = allSelectofTree.map(function(e) { return e.index; }).indexOf(selected[i].index);
                        //console.log(indice);
                        if(indice != -1){
                            allSelectofTree.splice(indice, 1);
                        }
                    }
                }else{
                    var indice = allSelectofTree.map(function(e) { return e.index; }).indexOf(selected.index);
                    //console.log(indice);
                    if(indice != -1){
                        allSelectofTree.splice(indice, 1);
                    }
                }

                arrangement();
            }

            function arrangement() {
                //console.log("entrer dans arrangement");
                lesSelects = allSelectofTree.map(function (e) {
                    return e.data;
                });
                /*console.log("lesSelects");
                console.log(lesSelects);*/
                scope.getAllselect({
                    lesSelects: lesSelects
                });
            }
            
            function addOrgUnitOnly(org) {
                //console.log("entrer dans addOrgUnitOnly");
                /*console.log("org");
                console.log(org);
                console.log("scope.treeArbre");
                console.log(scope.treeArbre);
                console.log("dataCopy");
                console.log(dataCopy);*/
                deleteColor(org);
                /*console.log("OrgUnique");
                console.log(OrgUnique);*/
                scope.getAllselect({
                    lesSelects: OrgUnique
                });
            }

            function findOrg(data, ui) {
                //console.log("entrer dans findOrg");
                //console.log(data);
                
                var a=0,b = data.length, cont = true;
                while(cont && a<b){
                    //console.log("org.ui = "+data[a].ui+" /// ui = "+ui);
                    if(data[a].ui == ui){
                        OrgUnique = data[a];
                    }else if(data[a].children && angular.isArray(data[a].children) && data[a].children.length >0){
                        findOrg(data[a].children, ui);
                    }
                    a++;
                    if(OrgUnique.ui){
                        cont = false;
                    }
                    
                }
                
            }
            
            function deleteColor(org) {
                //console.log("entrer dans deleteColor");
                //console.log(org);
                //console.log(angular.copy(oldOrg));
                var indice = oldOrg.index;
                /*console.log("indice = "+indice);
                console.log("scope.treeArbre");
                console.log(scope.treeArbre);*/
                if(indice > -1){
                    /*console.log("ancien trouvééé===");
                    console.log(angular.copy(oldOrg));*/
                    scope.treeArbre[indice].selected = false;
                }
                oldOrg = org;
                //console.log(angular.copy(oldOrg));
                OrgUnique = {};
                findOrg(dataCopy,org.ui);
            }
            
            
            


        }
    }
}]);