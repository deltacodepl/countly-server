/*global app,countlyAuth,countlySlippingAwayUsers,countlyVue,$,CV,CountlyHelpers,countlyCommon*/
(function() {

    var FEATURE_NAME = "slipping_away_users";

    var SlippingAwayUsersView = countlyVue.views.create({
        template: CV.T("/slipping-away-users/templates/slipping-away-users.html"),
        data: function() {
            return {
                progressBarColor: "#F96300",
            };
        },
        computed: {
            slippingAwayUsersFilters: {
                get: function() {
                    return this.$store.state.countlySlippingAwayUsers.filters;
                },
                set: function(value) {
                    this.$store.dispatch('countlySlippingAwayUsers/onSetFilters', value);
                    this.$store.dispatch("countlySlippingAwayUsers/fetchAll", true);
                }
            },
            slippingAwayUsersOptions: function() {
                return {
                    xAxis: {
                        data: this.xAxisSlippingAwayUsersPeriods,
                        axisLabel: {
                            color: "#333C48"
                        }
                    },
                    series: [{
                        data: this.$store.state.countlySlippingAwayUsers.series,
                        name: CV.i18n('slipping-away-users.barchart-description'),
                        color: this.progressBarColor

                    }]
                };
            },
            slippingAwayUsersRows: function() {
                return this.$store.state.countlySlippingAwayUsers.rows;
            },
            xAxisSlippingAwayUsersPeriods: function() {
                var periods = [];
                this.slippingAwayUsersRows.forEach(function(element) {
                    periods.push(CV.i18n('slipping-away-users.serie-item', element.period));
                });
                return periods;
            },
            isLoading: function() {
                return this.$store.getters['countlySlippingAwayUsers/isLoading'];
            }
        },
        methods: {
            onUserListClick: function(timeStamp) {
                var data = {
                    "lac": {"$lt": timeStamp}
                };
                var currentFilters = this.$store.state.countlySlippingAwayUsers.filters;
                if (currentFilters.query) {
                    Object.assign(data, CountlyHelpers.buildFilters(currentFilters));
                }
                window.location.hash = '/users/query/' + JSON.stringify(data);
            },
            refresh: function() {
                this.$store.dispatch("countlySlippingAwayUsers/fetchAll", false);
            },
            formatNumber: function(value) {
                return countlyCommon.formatNumber(value);
            }
        },
        mounted: function() {
            if (this.$route.params && this.$route.params.query) {
                this.$store.dispatch('countlySlippingAwayUsers/onSetFilters', {query: this.$route.params.query });
            }
            this.$store.dispatch("countlySlippingAwayUsers/fetchAll", true);
        }
    });

    if (countlyAuth.validateRead(FEATURE_NAME)) {
        countlyVue.container.registerTab("/analytics/loyalty", {
            priority: 2,
            name: "slipping-away-users",
            title: CV.i18n('slipping-away-users.title'),
            route: "#/" + countlyCommon.ACTIVE_APP_ID + "/analytics/loyalty/slipping-away-users",
            component: SlippingAwayUsersView,
            vuex: [{
                clyModel: countlySlippingAwayUsers
            }]
        });
    }

    $(document).ready(function() {
        if (countlyAuth.validateRead(FEATURE_NAME)) {
            if (app.configurationsView) {
                app.configurationsView.registerLabel("slipping-away-users", "slipping-away-users.config-title");
                app.configurationsView.registerLabel("slipping-away-users.p1", "slipping-away-users.config-first-threshold");
                app.configurationsView.registerLabel("slipping-away-users.p2", "slipping-away-users.config-second-threshold");
                app.configurationsView.registerLabel("slipping-away-users.p3", "slipping-away-users.config-third-threshold");
                app.configurationsView.registerLabel("slipping-away-users.p4", "slipping-away-users.config-fourth-threshold");
                app.configurationsView.registerLabel("slipping-away-users.p5", "slipping-away-users.config-fifth-threshold");
            }
        }
    });
})();