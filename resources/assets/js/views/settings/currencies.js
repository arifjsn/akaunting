/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./../../bootstrap');

import Vue from 'vue';

import DashboardPlugin from './../../plugins/dashboard-plugin';

import Global from './../../mixins/global';

import Form from './../../plugins/form';
import BulkAction from './../../plugins/bulk-action';

// plugin setup
Vue.use(DashboardPlugin);

const app = new Vue({
    el: '#app',

    mixins: [
        Global
    ],

    data: function () {
        return {
            form: new Form('currency'),
            bulk_action: new BulkAction('currencies')
        }
    },

    methods:{
        onChangeRate() {
            this.form.rate = this.form.rate.replace(',', '.');
        },

        onChangeCode(code) {
            if (! code) {
                return;
            }

            axios.get(url + '/settings/currencies/config', {
                params: {
                    code: code
                }
            })
            .then(response => {
                this.form.rate = response.data.rate;
                this.form.precision = response.data.precision;
                this.form.symbol = response.data.symbol;
                this.form.symbol_first = response.data.symbol_first;
                this.form.decimal_mark = response.data.decimal_mark;
                this.form.thousands_separator = response.data.thousands_separator;
            })
            .catch(error => {
            });
        }
    },

    watch: {
        'form.default_currency': function (newVal, oldVal) {
            if (newVal == 1) {
                this.form.rate = 1;
            }
        },
        'form.decimal_mark': function (newVal, oldVal) {
            const regex = /^[A-Za-z.,_-\s-]+$/;

            if (newVal && ! regex.test(newVal)) {
                newVal = newVal.replace(/[^A-Za-z.,_-\s-]+/g, ".");
            }

            this.form.decimal_mark = newVal;
        },
        'form.thousands_separator': function (newVal, oldVal) {
            const regex = /^[A-Za-z.,_-\s-]+$/;

            if (newVal && ! regex.test(newVal)) {
                newVal = newVal.replace(/[^A-Za-z.,_-\s-]+/g, ",");
            }

            this.form.thousands_separator = newVal;
        },
    }
});
