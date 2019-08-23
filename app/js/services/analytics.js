banque.factory('analytics', ['$resource', function( $resource ) {
    return $resource(baseUrl + '/api/26/analytics', {'id': '@id'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);