'use strict';

SearchEngineApp.controller("SearchController", function ($scope, $http, UtilSrvc) {
    $scope.parseXml = function (xml) {
        /// <signature>
        ///<summary>Parsing xml data to json</summary> 
        /// </signature>
        var dom = null;
        if (window.DOMParser) {
            try {
                dom = (new DOMParser()).parseFromString(xml, "text/xml");
            }
            catch (e) { dom = null; }
        }
        else if (window.ActiveXObject) {
            try {
                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom.async = false;
                if (!dom.loadXML(xml)) // parse error ..

                    window.alert(dom.parseError.reason + dom.parseError.srcText);
            }
            catch (e) { dom = null; }
        }
        else
            alert("cannot parse xml string!");
        return dom;
    };
    $http.get('/Config.xml').then(function (response) {
        /// <signature>
        ///<summary>Converting xml to json</summary> 
        /// </signature>
        var dom = $scope.parseXml(response.data);
        var json = $.xml2json(dom); 
    });

    $http.get('http://localhost:35752/PatientService.svc/GetMetadata').success(function (response) {
        $scope.tables = response;
        $scope.rows = [{
            rowId: 1, tables: response.tableNames,
            operator: response.Operators
        }];
    });
     
    $scope.GetSearch=function(){ 
        var objSearch = [];
        var tableName = "", operators = "", columnName = "", values = "", primarykey="";
        angular.forEach($scope.rows, function (item) {
            tableName += item.selectedtable.tblName + ",";
            operators += item.selectedOperator.sql_operator + ",";
            columnName += item.selectedField.ColumnName + ",";
            values += item.selectedValue + ",";
            primarykey += item.selectedtable.foreignkeyColName + ",";
        });
        // removing end comma
        tableName = tableName.substring(0, tableName.length - 1);
        operators = operators.substring(0, operators.length - 1);
        columnName = columnName.substring(0, columnName.length - 1);
        values = values.substring(0, values.length - 1);
        primarykey = primarykey.substring(0, primarykey.length - 1);
        objSearch.push({
            'tableName': tableName,
            'columnName': columnName,
            'operators': operators,
            'values': values,
            'primarykey':primarykey
        });
        $http({
            url: 'http://localhost:35752/PatientService.svc/GetSearch?criteria=' + JSON.stringify(objSearch),
            method: "GET" 
        }).success(function (response) {
            var data = {
            colNames: ['Name', 'Address'],
            data:response,
            colModel: [
                 { name: 'PatientName'  } ,
                { name: 'Address' }
               ]
        };
            var searchObj = {
                gridID: 'searchGrid',
                ht: 250,
                width: null,
                shrinkToFit: false,
                dataSource: data,
                PageSize: 5,
                sortBy: 'permobil_name',
                isDesc: false,
                RefreshGridHandler: null,
                CaptionText: null,
                customActionObj: null,
                gridCompleted: null,
                onRowDelete: null,
                rowDoubleClickHandler: null,
                onSelectRow: null
            };
            SE.CustomGrid.createGrid(searchObj);
            console.log(response);
        });
    }; 
    $scope.addNewRow = function () {
        /// <signature>
        ///<summary>Adding new rule</summary> 
        /// </signature>
        $scope.rows.push({
            rowId: 1, tables: $scope.rows[0]["tables"],
            operator: $scope.rows[0]["operator"]
        })
    }
    $scope.removeRow = function (item) {
        /// <signature>
        ///<summary>Removing rule</summary> 
        /// </signature>
        $scope.rows.pop({ "rowId": $scope.rows.length + 1 })
    } 

}); 