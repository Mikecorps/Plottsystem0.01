
var SqlHandler = angular.module('SqlHandler', []);
SqlHandler.controller('TablesHandler', function ($scope, $http, $rootScope) {
    $scope.Alldata;
    $scope.DBs = [];
    $scope.SelectedDB;
    $scope.tables = [];
    $scope.selectedTable;
    $scope.JsonData = [];
    $http.get('getdata')
    .then(function successCallback(response) {
        $scope.Alldata = response.data;
        angular.forEach(response.data, function (value, key) {
            this.push({ id: key, val: value.Key });
        }, $scope.DBs);
    });
    $scope.SelectDB = function ()
    {
        $scope.tables = [];
        angular.forEach($scope.Alldata[$scope.SelectedDB].Value, function (value, key) {
            this.push({ id: key, val: value.Key });
        }, $scope.tables);
    }
    $scope.getTable = function ()
    {
        $scope.JsonData = [];
        $scope.columns = $scope.Alldata[$scope.SelectedDB]['Value'][$scope.selectedTable].Value;
        $rootScope.$emit('columns', $scope.columns);
        var name = $scope.Alldata[$scope.SelectedDB]['Value'][$scope.selectedTable].Key;
        var config = { params: { table: name, catalog: $scope.Alldata[$scope.SelectedDB].Key }};
        $http.get('getTables', config)
        .then(function successCallback(response) {
            angular.forEach(response.data, function (value, key) {
                var temp = {};
                angular.forEach(value.Value, function (value, key) {
                    temp[$scope.columns[key]] = value;
                });
                $scope.JsonData.push(temp);
            });
            $rootScope.$emit('data', $scope.JsonData);
            var container = document.getElementById('table');
            var table = new Handsontable(container, {
                data: $scope.JsonData,
                colHeaders: $scope.columns,
                stretchH: 'all',
                width: 900,
                autoWrapRow: true,
                height: 300,
                //maxRows: 60,
                manualRowMove: true,
                manualColumnMove: true,
                filters: true,
                afterChange: function (changes, source) {
                    
                }

            });
            
        });

    }
});


SqlHandler.controller('charts', function ($scope, $rootScope) {
    $rootScope.$on('columns', function (event, data) { $scope.columns = data });
    $rootScope.$on('data', function (event, data) { $scope.data = data });
    $scope.chart = null;
    $scope.config = {};
    $scope.typeOptions = ["line", "bar", "spline", "step", "area"];
    $scope.config.bindto = '#chart';
    $scope.axis;
    $scope.keys = [];
    $scope.config.data = {};    
    $scope.config.data.type;
    $scope.config.data.onclick = function (d) {
        $scope.chart.data()[0].values.splice(d.index, 1);
        console.log($scope.chart.data()[0].values);
    };
    $scope.generate = function () {
        $scope.config.data.json = $scope.data;
        $scope.config.data.keys = { x: $scope.axis, "value": $scope.keys };
        $scope.config.axis = { x: { type: 'category' } };
        $scope.config.zoom = { enabled: true };
        $scope.chart = c3.generate($scope.config);
        
        
    }
  });