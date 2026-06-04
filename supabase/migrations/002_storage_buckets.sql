-- avatars bucket for user profile photos
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
create policy "Authenticated can view avatars"
  on storage.objects for select to authenticated using (bucket_id = 'avatars');
create policy "Authenticated can upload avatars"
  on storage.objects for insert to authenticated with check (bucket_id = 'avatars');
create policy "Users can update own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- person-photos bucket for family member photos
insert into storage.buckets (id, name, public) values ('person-photos', 'person-photos', true);
create policy "Authenticated can view person photos"
  on storage.objects for select to authenticated using (bucket_id = 'person-photos');
create policy "Authenticated can upload person photos"
  on storage.objects for insert to authenticated with check (bucket_id = 'person-photos');
