$(function(){

    var setTable = function(data){
        var $tblRisk = $('#tblRiskProgram > tbody');
        $tblRisk.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + v.program_risk + ' </td>'+
                '<td> '+
                '   <div class="btn-group btn-group-sm" role="group"> '+
                '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                '<i class="fa fa-cogs"> </i> </button> '+
                '<ul class="dropdown-menu"> '+
                '<li> '+
                '<a href="#" data-action="edit" data-name="'+ v.program_risk +'" data-id="'+ v.id +'") > '+
                '<i class="fa.fa-edit"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'">'+
                '<i class="fa fa-trash"> </i>ลบ </a></li></ul></div> ';
            $tblRisk.append(html);

        })
    }

    var getProgramRisk = function(){
        $.ajax({
            method:'POST',
            url:'/program/get_risk_program_total',
            dataType:'json'
        })
            .success(function(data){
                //setTable(data);
                $("#paging").paging(data.total, {
                    format: "< . (qq -) nnncnnn (- pp) . >",
                    perpage: 30,
                    lapping: 0,
                    page: 1,
                    onSelect: function (page) {
                        var startRecord = this.slice[0];
                        console.log(this.slice);
                        $.ajax({
                            method:'POST',
                            url:'/program/get_risk_program',
                            dataType:'json',
                            contentType:'application/json',
                            data: JSON.stringify({startRecord:startRecord})
                        })
                            .success(function(data){
                                setTable(data);
                            })
                        // Index.getService(start, end, startRecord, function (err, rows) {
                        //     if (err) console.log(err);
                        //     else Index.setServiceList(rows);
                        // });
                    },
                    onFormat: function (type) {
                        switch (type) {
                            case 'block':

                                if (!this.active)
                                    return '<li class="disabled"><a href="">' + this.value + '</a></li>';
                                else if (this.value != this.page)
                                    return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';
                                return '<li class="active"><a href="#">' + this.value + '</a></li>';

                            case 'right':
                            case 'left':

                                if (!this.active) {
                                    return "";
                                }
                                return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';

                            case 'next':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&raquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&raquo;</a></li>';

                            case 'prev':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&laquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&laquo;</a></li>';

                            case 'first':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&lt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&lt;</a></li>';

                            case 'last':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&gt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&gt;</a></li>';

                            case 'fill':
                                if (this.active) {
                                    return '<li class="disabled"><a href="#">...</a></li>';
                                }
                        }
                        return ""; // return nothing for missing branches
                    }
                });
            })
    };

    $('#show_search').fadeOut();
    $('#close_search').on('click',function(e){
        $('#show_detail').fadeIn();
        $('#show_search').fadeOut();
        $('#txtSearch').val('');
    });

    $('#btnShowSearch').on('click',function(e){
        $('#show_search').fadeIn();
        $('#show_detail').fadeOut();
    });

    $('#btnSearch').on('click',function(e){
        $('#show_detail').fadeIn();
    });

    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/program/remove_program',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        alert('ลบเสร็จเรีนบร้อยแล้ว');
                        getProgramRisk();
                    } else {
                        console.log(data.msg);
                        alert('ไม่สามารถบันทึได้')
                    }
                })
                .error(function(xhr, status, err){
                    console.log(err);
                    alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                })
        }

    });

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var name = $(this).data('name');
        var id = $(this).data('id');

        $('#txtName').val(name);
        $('#txtId').val(id);
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#btnShowModal').on('click',function(e){
        e.preventDefault();
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });
    $('#mdlNew').on('hidden.bs.modal', function (e) {
        $('#txtName').val('');
        $('#txtId').val('');// do something...
    });

    $('#btnSave').on('click',function(e){
        e.preventDefault();
        var name = $('#txtName').val();
        var id = $('#txtId').val();
        if(name){
            if(id){
                $.ajax({
                    method:'POST',
                    url:'/program/update_program',
                    dataType:'json',
                    data:{
                        name:name,
                        id:id
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('แก้ไขเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getProgramRisk();
                        } else {
                            console.log(data.msg);
                            alert('ไม่สามารถบันทึได้')
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
            }else{
                $.ajax({
                    method:'POST',
                    url:'/program/save_program',
                    dataType:'json',
                    data:{
                        name:name
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('บันทึกเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getProgramRisk();
                        } else {
                            console.log(data.msg);
                            alert('ไม่สามารถบันทึได้')
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
            }
  //save

        } else{
            alert('กรุณาระบุชื่อโปรแกรม')
        }
    });
    $('#paging').fadeIn();
    $('#btnSearch').on('click', function(e){
        e.preventDefault();
        var data = {};
        var search_topic = $('#txtSearch').val();
        data.topic = search_topic;

        $.ajax({
            type: "POST",
            url: "/program/search_topic",
            contentType:'application/json',
            dataType:'json',
            data: JSON.stringify(data)
        })
            .success(function(data){
               setTable(data);
                $('#paging').fadeOut();
            })
    });

    getProgramRisk();
})