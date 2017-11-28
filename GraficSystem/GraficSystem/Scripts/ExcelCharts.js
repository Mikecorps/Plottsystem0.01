var module = angular.module('excelApp', []);
module.controller('dataTable', function ($scope,$rootScope) {
    $rootScope.$on('ExcelData', function (event, data) {
        $scope.columns = [];
        angular.forEach(data[0], function (value, key) {
            this.push(key);
        },$scope.columns);
        var container = document.getElementById('xple');
        table = new Handsontable(container, {
            data: data,
            colHeaders: $scope.columns,
            stretchH: 'all',
            width: 900,
            autoWrapRow: true,
            height: 300,
            //maxRows: 60,
            manualRowMove: true,
            manualColumnMove: true,
            filters: true

        });
        $rootScope.$emit('data', data);
        $rootScope.$emit('columns', $scope.columns);
    });

    
});
module.directive('fileread', function ($rootScope) {
    return {
        scope: {
            fileread: '='
        },
        link: function (scope, element, attrubutes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        var fileread = loadEvent.target.result;
                        var workbook = XLSX.read(fileread, { type: 'binary' });
                        workbook.SheetNames.forEach(function (key) {
                            scope.fileread = XLSX.utils.sheet_to_json(workbook.Sheets[key]);
                            $rootScope.$emit('ExcelData', scope.fileread);
                            //console.log(scope.fileread);
                        })
                    });
                }
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });

        }
    }
});

module.controller('graphics', function ($scope,$rootScope) {
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
                        color: value.color,
                        size:11
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