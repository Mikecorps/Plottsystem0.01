
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


SqlHandler.controller('graphics', function ($scope, $rootScope) {
    var div = document.getElementById('chart');
    $rootScope.$on('columns', function (event, data) { $scope.columns = data });
    $rootScope.$on('data', function (event, data) { $scope.data = data });
    $scope.types = ["line", "box", "scatter", "bar"];
    $scope.type = $scope.types[0];
    $scope.Count = 1;
    $scope.ChartConfigs = [
       {
           'name': 'Grafica' + $scope.Count,
           'id': 'collapse_' + $scope.Count,
           'x': '',
           'y': '',
           'type': $scope.type,
           'color': $scope.color
       }
    ];
    $scope.config = {
        title: 'A Line Chart in Plotly',
        height: 550,
        width: 850,
        font: {
            family: 'Lato',
            size: 16,
            color: 'rgb(100,150,200)'
        },
        plot_bgcolor: 'rgba(200,255,0,0.1)',
        margin: {
            pad: 10
        },
        xaxis: {
            title: '',
            titlefont: {
                color: 'black',
                size: 12
            },
            rangemode: 'tozero'
        },
        yaxis: {
            title: '',
            titlefont: {
                color: 'black',
                size: 12
            },
            rangemode: 'tozero'
        },

    };
    $scope.generate = function () {

        var data = [];
        angular.forEach($scope.ChartConfigs, function (value, key) {
            var xAxis = [];
            angular.forEach($scope.data, function (val, key) {
                xAxis.push(val[value.x]);
            });
            var yAxis = [];
            angular.forEach($scope.data, function (val, key) {
                yAxis.push(val[value.y]);
            });

            if (value.type == "scatter") {
                this.push({
                    x: xAxis,
                    y: yAxis,
                    mode: "markers",
                    name: value.x + ' - ' + value.y,
                    marker: {
                        color: value.color
                    }
                });
            }
            else {

                this.push({
                    x: xAxis,
                    y: yAxis,
                    type: value.type,
                    name: value.x + ' - ' + value.y,
                    marker: {
                        color: value.color
                    }
                });
            }
        }, data);
        console.log(data);
        Plotly.newPlot(div, data, $scope.config, { modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d', 'hoverCompareCartesian'], displaylogo: false });
        div.on('plotly_selected', function (eventData) {
            console.log(eventData.points);
        });
    };
    $scope.newChart = function (ChartCount) {
        $scope.Count += 1;
        $scope.ChartConfigs.push({
            'name': 'Grafica' + $scope.Count,
            'id': 'collapse_' + $scope.Count,
            'x': '',
            'y': '',
            'type': ''
        });

    }


});