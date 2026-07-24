alter table public.products
  add column mold_code text,
  add constraint products_mold_code_valid
    check (
      mold_code is null
      or (
        mold_code = btrim(mold_code)
        and char_length(mold_code) between 1 and 40
      )
    );
