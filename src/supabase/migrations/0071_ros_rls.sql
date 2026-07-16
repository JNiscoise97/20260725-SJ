-- Tables ROS créées après la migration principale RLS (0009)
-- Même stratégie permissive que les autres tables : using (true) pour anon.

alter table _20260725_ros_messages enable row level security;
alter table _20260725_ros_delays enable row level security;
alter table _20260725_ros_launches enable row level security;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    '_20260725_ros_messages',
    '_20260725_ros_delays',
    '_20260725_ros_launches'
  ])
  loop
    execute format(
      'create policy "temp_anon_all_%1$s" on %1$s for all to anon using (true) with check (true);',
      t
    );
  end loop;
end $$;
