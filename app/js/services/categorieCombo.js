banque.factory('categoryComboResource', ['$resource', function( $resource ) {
    return $resource(baseUrl + '/api/categoryCombos/:id.json', {'id': '@id'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);

banque.factory('categoryOptionCombosResource', ['$resource', function( $resource ) {
    return $resource(baseUrl + '/api/categoryOptionCombos/:id.json', {'id': '@id'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);

banque.factory('categoryOptionsResource', ['$resource', function( $resource ) {
    return $resource(baseUrl + '/api/categoryOptions/:id.json', {'id': '@id'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);

banque.factory('categoriesResource', ['$resource', function( $resource ) {
    return $resource(baseUrl + '/api/categories/:id.json', {'id': '@id'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);