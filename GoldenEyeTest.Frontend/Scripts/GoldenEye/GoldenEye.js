var DEBUG = false;//true;

var app = (function () {
    function init() {
        if(componentsConfig)
            componentsConfig.init();

        routing.run();
        ko.applyBindings();

        ko.validation.locale('pl-PL');
        ko.validation.init({
            errorMessageClass: 'error-messages'
        });
    }

    return {

        viewModel: undefined,

        Init: init,

        current: ko.observable(),
        params: ko.observable()
    };

})();
$(document).ready(function () {
    app.Init();
});
function AuthManager() {
    var self = this;
    var tokenKey = "accessToken";

    var notifier = ko.observable();

    this.getToken = function () {
        notifier();
        return cache.Get(tokenKey);
    }

    this.clearToken = function () {
        cache.Clear(tokenKey);
        notifier.valueHasMutated();
    }

    this.setToken = function (token) {
        cache.Set(tokenKey, token);
        notifier.valueHasMutated();
    };

    this.isLogged = function () {
        return self.getToken() != undefined;
    }
}

var authManager = new AuthManager();
var routing = $.sammy(function () {
    var mappings = [];

    var loginComponentName;

    var defaultViewName;

    var changeRoute = function (view, params) {
        app.params(params);

        if (!authManager.getToken())
            app.current(loginComponentName);
        else {
            var matched = mappings.filter(function (el) { return el.view === view; });
            if (!matched || matched.length === 0)
                throw "RoutesConfig - component for view: " + view + " not found!";

            var componentName = matched[0].component;

            app.current(componentName);
        }

    }

    this.get("#:view/:id", function () {
        changeRoute(this.params.view, this.params.id);
    });

    this.get("#:view", function () {
        changeRoute(this.params.view);
    });

    this.get("", function () {
        changeRoute(defaultViewName);
    });
    
    this.init = function (options) {
        loginComponentName = options.loginComponentName || "login-nc";
        defaultViewName = options.defaultViewName;

        mappings = options.mappings;
    }

});
function CacheManager() {
    var self = this;

    self.Get = function (key) {
        var itemJSON = localStorage.getItem(key);

        if (!itemJSON || itemJSON === "undefined")
            return undefined;

        return JSON.parse(itemJSON);
    }

    self.Set = function (key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    self.Clear = function (key) {
        localStorage.removeItem(key);
    }

    self.ClearAll = function (key) {
        localStorage.clear();
    }

    self.Exists = function(key) {
        return localStorage.getItem(key) == undefined;
    }
}

var cache = new CacheManager();
jQuery.cachedScript = function (url, options) {

    // Allow user to set any option except for dataType, cache, and url
    options = $.extend(options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });

    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax(options);
};
// Register it
ko.components.loaders.unshift((function () {
    var componentsPrefix = "app/Components/";

    ////////////////////////////////////////////////////////
    ///                     PRIVATE                      ///   
    ////////////////////////////////////////////////////////

    function getClearComponentName(componentName) {
        var nameWithoutNc = componentName.replace("-nc", "");
        var capitalizedName = nameWithoutNc.charAt(0).toUpperCase() + nameWithoutNc.slice(1);

        return capitalizedName;
    }

    function getViewModelNameFromUrl(url) {
        var indexOfNameStart = url.lastIndexOf("/") + 1;

        return url.substring(indexOfNameStart).replace(".js", "");
    }

    function getViewPathFromComponentName(componentName) {
        var name = getClearComponentName(componentName);
        return name + "/" + name + "View.html";
    }

    function getViewModelPathFromComponentName(componentName) {
        var name = getClearComponentName(componentName);
        return name + "/" + name + "ViewModel.js";
    }

    function shouldUseNamingConventionForView(viewConfig) {
        return !viewConfig.element;
    }

    function shouldUseNamingConventionForViewModel(viewModelConfig) {
        return viewModelConfig.fromUrl;
    }

    function callDefaultBehaviour(callback) {
        callback(null);
    }

    function loadViewFromUrl(options) {
        var fullUrl = componentsPrefix + options.relativeUrl;// + "?cacheAge=" + (options.maxCacheAge || 1234);

        $.get(fullUrl, function (markupString) {
            ko.components.defaultLoader.loadTemplate(options.name, markupString, options.callback);
        }).fail(function () {
            callDefaultBehaviour(callback);
        });
    }

    function loadViewModelFromUrl(options) {
        var fullUrl = componentsPrefix + options.relativeUrl;

        $.cachedScript(fullUrl)
            .done(function () {
                var viewModelConstructor = window[getViewModelNameFromUrl(options.relativeUrl)];

                var viewModelInitialization = function (data) {
                    var viewModel = new viewModelConstructor();

                    if (viewModel.init)
                        viewModel.init(data);

                    return viewModel;
                };

                ko.components.defaultLoader.loadViewModel(options.name, viewModelInitialization, options.callback);
            }).fail(function () {
                callDefaultBehaviour(options.callback);
            });
    }

    ////////////////////////////////////////////////////////
    ///                     PUBLIC                       ///   
    ////////////////////////////////////////////////////////

    function getConfig(name, callback) {
        if (name.indexOf("-nc") === -1) {
            callDefaultBehaviour(callback);
            return;
        }
        
        //provide configuration for how to load the template/widget
        callback({
            template: { fromUrl: getViewPathFromComponentName(name)},
            viewModel: { fromUrl: getViewModelPathFromComponentName(name) }
        });
    }

    function loadViewModel(name, viewModelConfig, callback) {
        if (!shouldUseNamingConventionForViewModel(viewModelConfig)) {
            callDefaultBehaviour(callback);
            return;
        }

        var url = viewModelConfig.fromUrl || getViewPathFromComponentName(name);

        loadViewModelFromUrl({
            name: name,
            relativeUrl: url,
            maxCacheAge: viewModelConfig.maxCacheAge,
            callback: callback
        });
    }

    function loadTemplate(name, templateConfig, callback) {
        if (!shouldUseNamingConventionForView(templateConfig)) {
            callDefaultBehaviour(callback);
            return;
        }

        var url = templateConfig.fromUrl || getViewPathFromComponentName(name);

        loadViewFromUrl({
            name: name,
            relativeUrl: url,
            maxCacheAge: templateConfig.maxCacheAge,
            callback: callback
        });
    }

    return {
        getConfig: getConfig,
        loadTemplate: loadTemplate,
        loadViewModel: loadViewModel
    };
})());
function UserDataProvider() {
    var self = this;

    var userDataKey = "UserData";

    var userName = undefined;

    var notifier = ko.observable();

    function UpdateUser(data) {
        cache.Set(userDataKey, data);
        notifier.valueHasMutated();
    }

    self.Get = function () {
        notifier();

        if (!authManager.isLogged()) {
            return {};
        }

        var cached = cache.Get(userDataKey);

        if (cached) {
            return cached;
        }

        userService.getUser(userName, UpdateUser);

        return cached;
    }

    self.Set = function (email) {
        userName = email;
        self.Clear();
    }

    self.Clear = function () {
        cache.Clear(userDataKey);
        notifier.valueHasMutated();
    }
}

var userData = new UserDataProvider();
ko.ext = ko.ext || {};

ko.ext.updateViewModel = function(viewModel, model) {
    for (var prop in model) {
        if (model.hasOwnProperty(prop))
            if (viewModel[prop] && $.isFunction(viewModel[prop]))
                viewModel[prop](model[prop]);
    }
}
