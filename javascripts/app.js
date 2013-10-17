(function() {
  var App, Db, SELECT_TYPE, SEMESTER, SYSTEM, YEAR, clearOldData, processQuery;

  processQuery = function(db, i, queries, dbname, callback) {
    if (i < queries.length - 1) {
      if (!queries[i + 1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)) {
        queries[i + 1] = queries[i] + ';\n' + queries[i + 1];
        return processQuery(db, i + 1, queries, dbname, callback);
      }
      return db.transaction(function(query) {
        return query.executeSql(queries[i] + ';', [], function(tx, result) {
          return processQuery(db, i + 1, queries, dbname, callback);
        });
      }, function(err) {
        console.log("Query error in ", queries[i], err.message);
        return processQuery(db, i + 1, queries, dbname, callback);
      });
    } else {
      if (typeof callback === "function") {
        callback();
      }
      return console.log("Done importing!");
    }
  };

  clearOldData = function(db, dbname) {
    return db.transaction(function(query) {
      return query.executeSql("select 'drop table ' || name || ';' as cmd from sqlite_master where type = 'table';", [], function(query, results) {
        var command, i, _, _i, _len, _ref, _results;

        _ref = results.rows;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          _ = _ref[i];
          command = results.rows.item(i).cmd;
          _results.push(query.executeSql(command, [], function(query, results) {
            return command = null;
          }, function(query, error) {
            return console.log(error.message);
          }));
        }
        return _results;
      });
    });
  };

  Db = openDatabase('mcu', '1.0', 'MCU Course Database', 1024 * 1024);

  clearOldData(Db, 'mcu');

  SELECT_TYPE = {
    1: '通識',
    2: '必修',
    3: '選修',
    4: '教育'
  };

  SYSTEM = {
    1: '大學日間部',
    2: '碩士班',
    3: '海青班',
    4: '研碩士班',
    5: '博士班',
    6: '碩士專班'
  };

  SEMESTER = {
    1: '上學期',
    2: '下學期',
    3: '全學期'
  };

  YEAR = {
    0: '不區分',
    1: '一年級',
    2: '二年級',
    3: '三年級',
    4: '四年級',
    5: '五年級'
  };

  App = angular.module('CourseQuery', []);

  App.controller("CourseController", function($scope) {
    $scope.page = 1;
    $scope.perPage = 25;
    $scope.maxPage = 1;
    $scope.ready = false;
    $scope.course_query = "";
    $scope.course_code_query = "";
    $.get('mcu.sql', function(data) {
      return processQuery(Db, 2, data.split(';\n'), 'mcu', function() {
        $scope.ready = true;
        return $scope.$apply();
      });
    });
    $scope.courses = [];
    $scope.formatSelectType = function(code) {
      return SELECT_TYPE[code];
    };
    $scope.formatSystem = function(code) {
      return SYSTEM[code];
    };
    $scope.formatSemester = function(code) {
      return SEMESTER[code];
    };
    $scope.formatYear = function(code) {
      return YEAR[code];
    };
    $scope.getCourses = function(perPage) {
      var page, returnData;

      page = $scope.page || 1;
      $scope.perPage = perPage;
      $scope.maxPage = Math.ceil($scope.courses.length / perPage);
      returnData = $scope.courses.slice((page - 1) * perPage, page * perPage);
      return returnData;
    };
    $scope.getRepeat = function(number) {
      return new Array(number);
    };
    $scope.changePage = function(page) {
      return $scope.page = page;
    };
    return $scope.update = function() {
      var queryString, querys;

      $scope.page = 1;
      $scope.maxPage = 1;
      $scope.courses = [];
      if ($scope.course_query.length <= 0 && $scope.course_code_query.length <= 0) {
        return;
      }
      querys = [];
      if ($scope.course_query.length > 0) {
        querys.push("course_name LIKE '%" + $scope.course_query + "%'");
      }
      if ($scope.course_code_query.length > 0) {
        querys.push("course_code LIKE '%" + $scope.course_code_query + "%'");
      }
      queryString = querys.join(" AND ");
      return Db.transaction(function(query) {
        return query.executeSql("SELECT * FROM courses WHERE " + queryString + ";", [], function(query, results) {
          var course, i, _, _i, _len, _ref, _results;

          _ref = results.rows;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            _ = _ref[i];
            course = results.rows.item(i);
            $scope.courses.push({
              system: course.system,
              select_type: course.select_type,
              code: course.course_code,
              class_code: course.class_code,
              name: course.course_name,
              selected_people: course.selected_people,
              max_people: course.max_people,
              credit: course.credit,
              year: course.year,
              semester: course.semester
            });
            _results.push($scope.$apply());
          }
          return _results;
        }, function(query, error) {
          return console.log("Error: " + error.message);
        });
      });
    };
  });

}).call(this);
