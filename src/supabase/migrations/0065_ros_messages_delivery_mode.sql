alter table _20260725_ros_messages
  add column if not exists delivery_mode text; -- 'micro' | 'discret'
