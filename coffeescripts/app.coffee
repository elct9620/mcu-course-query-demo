# SQLite Importer
processQuery =  (db, i, queries, dbname, callback)->
  if i < queries.length - 1
    #console.log(i + ' of '+ queries.length);
    if !queries[i+1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)
      queries[i+1] = queries[i]+ ';\n' + queries[i+1];
      return processQuery(db, i+1, queries, dbname, callback);

    #console.log('------------>', queries[i]);
    db.transaction((query)->
      query.executeSql(queries[i]+';', [], (tx, result)->
        processQuery(db, i + 1, queries, dbname, callback);
      )
    ,(err)->
      console.log("Query error in ", queries[i], err.message)
      processQuery(db, i + 1, queries, dbname, callback)
    )
  else
    if typeof(callback) is "function"
      callback()
    console.log("Done importing!")

clearOldData = (db, dbname)->
  db.transaction (query)->
    query.executeSql "select 'drop table ' || name || ';' as cmd from sqlite_master where type = 'table';", [], (query, results) ->
      for _, i in results.rows
        command = results.rows.item(i).cmd
        query.executeSql command, [], (query, results) ->
          # Nothing to do
          command = null
        ,(query, error) ->
          console.log error.message

# Import SQlite
if window.openDatabase
  Db = openDatabase('mcu', '1.0', 'MCU Course Database', 1024 * 1024)
  clearOldData(Db, 'mcu')

# Static Datas
SELECT_TYPE = {
  1: '通識'
  2: '必修'
  3: '選修'
  4: '教育'
}

SYSTEM = {
  1:'大學日間部',
  2: '碩士班',
  3: '海青班',
  4: '研碩士班',
  5: '博士班',
  6: '碩士專班'
}

SEMESTER = {
  1: '上學期'
  2: '下學期'
  3: '全學期'
}

YEAR = {
  0: '不區分'
  1: '一年級',
  2: '二年級',
  3: '三年級',
  4: '四年級',
  5: '五年級'
}

# Angular App

App = angular.module 'CourseQuery', ['ngRoute']

App.controller "CourseController", ['$scope', ($scope)->

  $scope.page = 1
  $scope.perPage = 25
  $scope.maxPage = 1
  $scope.ready = false
  $scope.error = false
  $scope.loadingMessage = "讀取課程資料中⋯⋯"

  $scope.course_query = ""
  $scope.course_code_query = ""

  $.get 'mcu.sql', (data)->
    if window.openDatabase
      processQuery Db, 2, data.split(';\n'), 'mcu', ()->
        $scope.ready = true
        $scope.$apply()
    else
      $scope.error = true
      $scope.loadingMessage = "因為支援問題無法取得資料庫，建議使用 Chrome 讀取（將會在未來被修正）"
      $scope.$apply()

  $scope.courses = []

  $scope.formatSelectType = (code)->
    return SELECT_TYPE[code]

  $scope.formatSystem = (code)->
    return SYSTEM[code]

  $scope.formatSemester = (code)->
    return SEMESTER[code]

  $scope.formatYear = (code)->
    return YEAR[code]

  $scope.getCourses = (perPage)->
    page = $scope.page || 1
    $scope.perPage = perPage
    $scope.maxPage = Math.ceil($scope.courses.length / perPage)

    returnData = $scope.courses.slice((page - 1) * perPage, page * perPage)
    return returnData

  $scope.getRepeat = (number)->
    new Array(number)

  $scope.changePage = (page)->
    $scope.page = page

  $scope.update = ->
    $scope.page = 1
    $scope.maxPage = 1
    $scope.courses = []
    return if $scope.course_query.length <= 0 and $scope.course_code_query.length <= 0

    querys = []
    querys.push("course_name LIKE '%#{$scope.course_query}%'") if $scope.course_query.length > 0
    querys.push("course_code LIKE '%#{$scope.course_code_query}%'") if $scope.course_code_query.length > 0
    queryString = querys.join(" AND ")

    Db.transaction (query) ->
      query.executeSql "SELECT * FROM courses WHERE #{queryString};", [], (query, results)->
        for _, i in results.rows
          course = results.rows.item(i)
          $scope.courses.push({
            system: course.system
            select_type: course.select_type
            code: course.course_code
            class_code: course.class_code
            name: course.course_name
            selected_people: course.selected_people
            max_people: course.max_people
            credit: course.credit
            year: course.year
            semester: course.semester
          })
          $scope.$apply()
      ,(query, error)->
        console.log "Error: #{error.message}"
]

App.controller 'CalendarController', ['$scope', ($scope)->

]


App.config ['$routeProvider', ($routeProvider)->
  $routeProvider.when('/default', {
    templateUrl: 'partials/default.html',
    controller: 'CourseController'
  })
  .when('/calendar',
    templateUrl: 'partials/calendar.html',
    controller: 'CalendarController'
  ).otherwise({
    redirectTo: '/default'
  })
]
