
;(function () {
   'use strict';
   var $form_add_task = $('.add-list')
     , new_task ={}
     , task_list = {}
     ;
     
     init();
   $form_add_task.on('submit', function(e) {
      // 禁用默认行为
      e.preventDefault(); 
      // 获取新task的值
      new_task.content = $(this).find('input[name=content]').val();
      // 如果新Task的值是空，直接返回，否则继续执行
      if (!new_task.content) return;
      // 存入新的Task
      if (add_task(new_task)) {
        render_task_list();
      }
      // console.log('new_task', new_task );
    }) 

       function add_task(new_task) {
        // 存入Task推入task_list
         task_list.push(new_task);
         // 更新localStorager
         store.set('task_list', task_list);
         return true;
         // console.log('task_list', task_list);
       }
       function init() {
          task_list = store.get('task_list') || [];
          if (task_list.length)
            render_task_list();
       }
       function render_task_list() {
        var $task_list = $('.task_list');
        for (var i =0; i < task_list.length; i++) {
            var $task = render_task_tpl(task_list[i]);
            $task_list.append($task);
        }
       }
       function render_task_tpl(data) {
            var list_item_tpl=
              '<div class="task-item"> '+
              '<span><input type="checkbox"></span>' +
              '<span class="task-content">内容</span>' +
              '<span>删除</span>' +
              '<span>显示详情</span>' +
              '</div>';
            return $(list_item_tpl);
       }
})();