
        Ext.onReady(function () {

            //////----------------------------FORM COMPONENT TO SUBMIT DATA---------------------------///////
            Ext.QuickTips.init();

            var form = Ext.create('Ext.form.Panel', {
                id: 'newForm',
                renderTo: 'divForForm',
                url: 'http://localhost:8080/api',
                jsonSubmit: true,
                border: true,
                width: 300,
                items: [{
                    xtype: 'textfield',
                    id: 'name',
                    name: 'name',
                    fieldLabel: 'Name',
                    msgTarget: 'under',
                    placeHolder: 'Enter name',
                    allowBlank: false

                }, {
                    xtype: 'textfield',
                    id: 'email',
                    name: 'email',
                    fieldLabel: 'Email',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    id: 'address',
                    name: 'address',
                    fieldLabel: 'Address',
                    allowBlank: false
                },
                {
                    xtype: 'button',
                    text: 'Create',
                    scope: this,
                    formBind: true,
                    handler: function (btn) {


                        form.submit({
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            success: function () {

                                user.add({
                                    name: Ext.getCmp('name').getValue(), email: Ext.getCmp('email').getValue(),
                                    address: Ext.getCmp('address').getValue()
                                })
                                console.log("success!")
                                //user.sync();
                                Ext.Msg.alert("Success", "The record was added to the database")
                                form.reset();
                            },
                            failure: function () {
                                Ext.Msg.alert("Try again", "Server error...")
                            },
                            waitTitle: "Pushing data........"

                        });


                    }
                },



                ]


            });



            /////------------------------------------Grid rendering from API-------------------------------///////


            var model = Ext.define('User', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'Id',
                    type: 'string'
                },
                {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'email',
                    type: 'string'
                }, {
                    name: 'Address',
                    type: 'string'
                }]
            });


            var user = Ext.create('Ext.data.Store', {
                storeId: 'user',
                model: 'User',
                autoLoad: 'true',
                proxy: {
                    type: 'ajax',
                    url: 'http://localhost:8080/api/all',
                    reader: {
                        type: 'json',
                        root: 'users'
                    }
                }

            });



            ////////////-------------------------------GRID TO DISPLAY DATA-------------------------------///////

            Ext.create('Ext.grid.Panel', {
                store: user,
                id: 'user',
                title: 'Users',


                columns: [{
                    header: 'ID',
                    dataIndex: 'id'
                }, {
                    header: 'NAME',
                    dataIndex: 'name',
                    filters: true
                }, {
                    header: 'Email',
                    dataIndex: 'email',
                    width: 250
                }, {
                    header: 'Address',
                    dataIndex: 'address',
                    width: 250
                }
                ],

                listeners: {

                    select: function (grid, record) {


                        console.log(record.get('name'));
                        Ext.Msg.confirm('Delete record', 'Are you sure?',
                            function (choice) {
                                if (choice === 'yes') {

                                    user.remove(record);

                                    Ext.Ajax.request({

                                        url: 'http://localhost:8080/api/delete?Id=' + record.getId(),

                                        success: function (response) {
                                            var text = response.responseText;
                                            // process server response here
                                            console.log(text)
                                        }
                                    })

                                    console.log("deleted");
                                }
                            }, this);

                    }
                },


                height: 300,
                width: 800,
                renderTo: 'divForGrid',


            })




        });


