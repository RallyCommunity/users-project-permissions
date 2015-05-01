Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        Ext.create('Rally.data.wsapi.Store', {
            model: 'ProjectPermission',
            limit: Infinity,
            fetch:['User','Role','Name', 'Project','UserName','SubscriptionAdmin','Workspace'],
            autoLoad: true,
            listeners: {
                load: function(store, data, success){
                     this._onDataLoaded(store,data);
                } ,
                scope: this
            }
        });
    },
    _onDataLoaded:function(store,results) {
        _.remove(results, function(result){
            return result.get('User').SubscriptionAdmin === true;
        });
        var permissions = _.reduce(results, function(finalResult, permissionRecord){
            finalResult[permissionRecord.get('User').UserName] = (finalResult[permissionRecord.get('User').UserName] || []).concat(permissionRecord.get('Project')._refObjectName + ' / ' + permissionRecord.get('Role'));
            return finalResult;
        },{}) ;
        this._show(permissions);
    },
    _show:function(permissions)  {
        var arrayOfPermissions = [];
        _.each(permissions, function(value,key){
            arrayOfPermissions.push({'user':key,'projects':value});
        });

        this.add({
            xtype: 'rallygrid',
            showPagingToolbar: true,
            showRowActionsColumn: false,
            editable: false,
            store: Ext.create('Rally.data.custom.Store', {
                data: arrayOfPermissions
            }),
            columnCfgs: [
                {
                    text: 'User',dataIndex: 'user', minWidth: 500
                },
                {
                    text: 'Project / Role',dataIndex: 'projects', minWidth: 500, renderer: function(projects){
                        var text = [];
                        _.each(projects, function(project){
                             text.push(project);
                        });
                        return text.join('<br />');
                    }
                }
            ],
            margin: 10
        });
    }
});