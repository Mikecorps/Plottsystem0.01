var dataToGraphics = [];
var module = angular.module('oracleTab', []);
module.factory()
module.controller('view', function ($scope, $http, $rootScope) {
    $scope.tables = null;
    $scope.table;
    $scope.names = [];
    $scope.columns = [];
    $scope.load = function () {
        $http.get('getTables')
        .then(function succesCallback(response) {
            $scope.tables = response.data;
            angular.forEach($scope.tables, function (value, key) {
                this.push({ id: key, name: value.key });
            }, $scope.names);

        });
    };
    $scope.loadTables = function () {
        dataToGraphics = [];
        $scope.columns = [];
        $scope.rows = [];
        angular.forEach($scope.tables[$scope.table].values, function (value, key) {
            $scope.columns.push(value);
        });

        $rootScope.$emit('Columns', $scope.columns);
        var parameters = { table: $scope.tables[$scope.table].key };
        var config = { params: parameters };
        $http.get('getData', config)
        .then(function succesCallback(response) {
            angular.forEach(response.data, function (value, key) {
                var o = {};
                angular.forEach(value.value, function (value, key) {
                    o[$scope.columns[key]] = value;
                });
                $scope.rows.push(o);
            });
            
            $rootScope.$emit('data', $scope.rows);
            var container = document.getElementById('table');
            var table = new Handsontable(container, {
                data: $scope.rows,
                colHeaders: $scope.columns,
                stretchH: 'all',
                width: 900,
                autoWrapRow: true,
                height: 300,
                //maxRows: 60,
                manualRowMove: true,
                manualColumnMove: true,
                filters: true,
                afterChange: function (changes, source)
                {
                    
                }

            });
        });
    }
    $scope.load();
});
module.controller('graphics', function ($scope, $rootScope) {
    var div = document.getElementById('chart');
    $rootScope.$on('Columns', function (event, data) {$scope.columns = data });
    $rootScope.$on('data', function (event, data) { $scope.data = data });
    $scope.types = ["line", "box", "scatter","bar"];
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
        title:'A Line Chart in Plotly',
        height: 550,
        width:850,
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
        },data);
        console.log(data);
        Plotly.newPlot(div, data, $scope.config, { modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d','hoverCompareCartesian'], displaylogo: false });
        div.on('plotly_selected', function (eventData) {
            console.log(eventData.points);
        });
    };
    $scope.newChart = function (ChartCount) {
        $scope.Count += 1;
        $scope.ChartConfigs.push({
            'name':'Grafica'+$scope.Count,
            'id': 'collapse_' + $scope.Count,
            'x':   '',
            'y': '',
            'type': ''
        });
       
    }
    

});


