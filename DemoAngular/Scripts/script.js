﻿/// <reference path="angular.js" />
/// <reference path="angular-route.js" />
 
var app = angular
    .module("Demo", ["ngRoute"])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.caseInsensitiveMatch = true;
        $routeProvider
            .when("/home", {
                //template:"<h1>Inline Template in Action</h1>",
                templateUrl: "Templates/home.html",
                controller: "homeController",
            })
            .when("/courses", {
                templateUrl: "Templates/courses.html",
                controller: "coursesController",
             })
            .when("/students", {
                templateUrl: "Templates/students.html",
                controller: "studentsController",
                controllerAs: "studentsCtrl"
             })
            .when("/students/:id", {
                templateUrl: "Templates/studentDetails.html",
                controller: "studentDetailsController"
            })
            .otherwise({
                redirectTo:"/home"
            })
        $locationProvider.html5Mode(true);
    })
app.controller("homeController", function ($scope) {
         $scope.message = "Home Page";
    })
app.controller("coursesController", function ($scope) {
        $scope.courses = ["C#", "VB.NET", "ASP.NET", "SQL Server"];
})

// Removed $scope and Using this 
app.controller("studentsController", function ($http, $route, $scope,  $log, $location) {
    var vm = this;

    vm.searchStudent = function () {
        if (vm.searchname) {
            $location.url("/studentsSearch" + vm.searchname);
        }
        else {
            $location.url("/studentsSearch" );
        }
    }


    $scope.$on("$routeChangeStart", function (event, next, current) {
        $log.info("RouteChangeStart Event");
        $log.info(event);
        $log.info(next);
        $log.info(current);
    });

    $scope.$on("$locationChangeStart", function (event, next, current) {
        $log.debug("LocationChangeStart Event");
        $log.debug(event);
        $log.debug(next);
        $log.debug(current);
    });


    $scope.$on("$routeChangeStart", function (event, next, current) {
        if (!confirm("Are you sure you want to navigate away from this page to "
            + next.$$route.originalPath        )) {
            event.preventDefault();
        }
    });





    vm.reloadData = function () {
        $route.reload();
    }
        $http.get("StudentService.asmx/GetAllStudents")
            .then(function (response) {
                vm.students = response.data;
            })
    })

app.controller("studentDetailsController", function ($scope, $http, $routeParams) {
    $http({
        url: "StudentService.asmx/GetStudent",
        method: "get",
        params: { id: $routeParams.id }
    }).then(function (response) {
        $scope.student = response.data;
    })
})
