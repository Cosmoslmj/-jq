
;(function () {
   'use strict';
   var $form_add_list = $('.add-list')
     , $task_delete_trigger
     , $task_detail
     , $task_detail_trigger
     , $task_detail = $('.task-detail')
     , $task_detail_mask = $('.task-detail-mask')
     , task_list = []
     , current_index
     , $update_form
     , $task_detail_content
     , $task_detail_content_input
     , $checkbox_complete
     ;

     init();
   $form_add_list.on('submit', on_add_list_form_submit)
   $task_detail_mask.on('click', hide_task_detail)
   function on_add_list_form_submit(e) {
      var new_task = {}, $input;
      // 禁用默认行为
      e.preventDefault(); 
      // 获取新task的值
      $input = $(this).find('input[name=content]');
      new_task.content = $input.val();
      // 如果新Task的值是空，直接返回，否则继续执行
      if (!new_task.content) return;
      // 存入新的Task
      if (add_list(new_task)) {
        // render_task_list();
        $input.val(null);
      }  
   }
   // 点击详情监听打开Task详情事件
   function listen_task_detail() {
    var index;
    $('.task-item').on('dblclick', function() {
      index = $(this).data('index');
      show_task_detail(index);
    })
    $task_detail_trigger.on('click', function() {
      var $this = $(this);
      var $item = $this.parent().parent();
      index = $item.data('index')
      show_task_detail(index);
    })
   }
    // 监听完成任务事件
    function listen_checkbox_complete() {
      $checkbox_complete.on('click', function() {
        var $this = $(this);
        // var is_complete = $this.is(':checked');
        var index = $this.parent().parent().data('index');
        var item = get(index);
        if (item.complete)
          update_task(index, {complete: false});
          // $this.attr('checked', true);
        else 
          update_task(index, {complete: true});
          // $this.attr('checked', false);
          // prop('checked', false)
      })
    }
    
    function get(index) {
      return store.get('task_list')[index];
    }

     // 查看task详情 
  function show_task_detail(index) {
    // 生成详情模版
    render_task_detail(index)
    current_index = index;
    // 默认隐藏，点击详情显示详情模版
    $task_detail.css('display', 'block');
    // 显示详情背景mask
    $task_detail_mask.show(); 
  }

  // 更新task
  function update_task(index, data) {
    if(!index || !task_list[index])
      return;
    // complete: true /false
    //merge 数组 extend 对象;
     task_list[index] = $.extend({}, task_list[index], data);
    refresh_task_list();
  }
  // 点击旁边隐藏task详情
    function hide_task_detail() {
    $task_detail.hide();
    $task_detail_mask.hide(); 
  }
// 渲染指定task详细信息
  function render_task_detail (index) {
    if (index === undefined || !task_list[index])
     return;
    var item = task_list[index];

// 渲染模版
     var tpl =  '<form>' +
        '<div class="content">' + 
          item.content +  
      '</div>'+ 
      '<div class="input-item">' +
      '<input style="display: none;" type="text" name="content" value="' + (item.content || '') +'">' +
      '</div>' +
      '<div>'+  
          '<div class="desc input-item">'+
              '<textarea name="desc">' + (item.desc || '') + '</textarea>' +
          '</div>' +
      '</div>' +
      '<div class="remind input-item"> ' + 
          '<label> 提醒时间 </label>' + 
          '<input class="datetime" type="text" name="remind_date" value="' + (item.remind_date || '') +'">' +
      '</div> ' + 
      '<div class="input-item"><button type="submit">更新</button></div>' +
     '</form>';

     // 清空详情模版
     $task_detail.html(null);

     // 再添加新模版
     $task_detail.html(tpl);

     $('.datetime').datetimepicker();

     // 选中期中一个form元素，因为之后会使用其监听submit事件
     $update_form = $task_detail.find('form');

     // 选中显示Task内容的元素
     $task_detail_content = $update_form.find('.content');

     // 选中显示Task input的元素
     $task_detail_content_input = $update_form.find('[name=content]');

     // 双击内容元素显示input 隐藏自己
     $task_detail_content.on('dblclick', function () {
        $task_detail_content_input.show();
        $task_detail_content.hide();
     })
     $update_form.on('submit', function(e) {
       e.preventDefault();
       var data = {};
       // 获取表单中各个input的值
       data.content = $(this).find('[name=content]').val();
       data.desc = $(this).find('[name=desc]').val();
       data.remind_date = $(this).find('[name=remind_date]').val();
       update_task(index, data);
       hide_task_detail();
       // console.log(data);
       // console.log('ttt');
     })

  }
      // 查找并监听所有删除按钮的点击事件
      function listen_task_delete() {
        $task_delete_trigger.on('click', function() {
          var $this = $(this);
          // 找到删除按钮所在的task元素
          var $item = $this.parent().parent();
          var index = $item.data('index');
          // 确认删除
          var tmp = confirm('确定删除？')
          tmp ? delete_task(index) : null;
        })
      }
       function add_list(new_task) {

        // 存入Task推入task_list
         task_list.push(new_task);
         // 更新localStorager
         refresh_task_list();
         // store.set('task_list', task_list);
         return true;
         // console.log('task_list', task_list);
       }
       // 删除一条task
       function delete_task(index) {
        // 如果没有Index 或者index不存在，直接返回
        if(index === undefined || !task_list[index]) return;
        delete task_list[index];
         // 更新localStorager
          refresh_task_list();
       }
       /*
   * 刷新localStorage数据并渲染模板
   * */
        function refresh_task_list() {
          store.set('task_list', task_list);
          render_task_list();
        }

       function init() {
        // store.clear();
          task_list = store.get('task_list') || [];
          if (task_list.length)
            render_task_list();
          // listen_task_delete();
       }
       // 渲染全部task模版
       function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        var complete_items = [];
        for (var i = 0; i < task_list.length; i++) {
            var item = task_list[i];
            if (item && item.complete)
              complete_items[i] = (item);
            else 
            var $task = render_task_item(item, i);
            $task_list.prepend($task);  //往前加  append往后加
            // console.log('task_list', task_list );
        }
        for(var j = 0; j <complete_items.length; j++) {          
          $task = render_task_item(complete_items[j], j);
          if (!$task) continue;
          $task.addClass('completed');
          $task_list.append($task); 
        }
        $task_delete_trigger  = $('.action.delete')
        $task_detail_trigger = $('.action.detail')
        $checkbox_complete = $('.task-list .complete[type=checkbox]')
        listen_task_delete();
        listen_task_detail();
        listen_checkbox_complete();
       }
       // 渲染单条task模版
       function render_task_item(data, index) {
          if(!data || !index) return;
             var list_item_tpl =
              '<div class="task-item" data-index="'+ index +'">'+
              '<span><input class="complete"' + (data.complete ? 'checked' : '') + ' type="checkbox"></span>' +
              '<span class="task-content">' + data.content + '</span>' +
              '<span class="fr">' +
              '<span class="action delete"> 删除</span>' +
              '<span class="action detail">详细</span>' +
              '<span>' +
              '</div>';
            return $(list_item_tpl);
       }
})();