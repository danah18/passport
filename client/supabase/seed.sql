  insert into public.restaurants
  (name, location)
values
  ('Supa Burger', gis.st_point(-73.946823, 40.807416)),
  ('Supa Pizza', gis.st_point(-73.94581, 40.807475)),
  ('Supa Taco', gis.st_point(-73.945826, 40.80629));

  insert into public.pins
  (google_place_id, location, pin_name, metadata)
values
  ('ChIJUUP02eUM3IARv03jidyvySQ', gis.st_point(-117.305, 33.07166670000000), 'Just Peachy Market', '{
    "formattedAddress": "1354 N Coast Hwy 101, Encinitas, CA 92024, USA",
    "rating": 4.7,
    "userRatingCount": 201,
    "googleMapsUri": "https://maps.google.com/?cid=2650843217425288639",
    "displayName": "Just Peachy Market",
    "photos": [
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ39hCQYcn4o7hIzi9UNNrOL1ET6LJ4c5r5h8TOtJdFZqkCCl0TyKnhCte9PhuKv3p4NS0XpZGJVpxacl5TwCupC0UWXd_yrBi8qdTKyYvK_A41mUl9fETrUH5goIfQOy5ou_tXQihuTwfAAaULKfSTpRdhsNMDznRGZCDNtHvryUi8q0xSlOB0Cx-TW-FwJDz9zMzbo0xv9nHib2lxGbHsr5nz0Hc-mAlhdIUj1rxdLEAE2SQ5hhd5JVVNHut-pzu2pvVT7kAjOm_S0GqRJLo4MSDvbJRne4YA9BciCX1Pb8CXabh23guapHC-leL-eOhyL1v9LJLpqFbmxyRw2VPg561LeuXEeZd-cPk8iYf2TuerQN9GgKe3BtXAg5Gy1sAIFQz4dklGbMbCgCxPpAh5tIpD30wDXrt5fBxagph_TCH4",
        "widthPx": 4032,
        "heightPx": 3024
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ0am8NMKYsI1yTRQQnfNWKdRpTTAXt1-HfJX5yIZJE5mDadaNCXAIfFu0iizaKfoSigKCyakuhPJeNcApMEOyq537UzDaNjTn7iAyBlwDtelUZzH3dykhj5TPRZTVHOjksCLo4BVI1OhiIEvXMisX-3mgJ00OzLNnM5AUBj8xqnHMRfuYXgFiGrE6-rc4m35Gbtk9wMoDk7DSN8btY5WZ3e4KwTzdmN46pnf-nZ6Px7glxLuUTGRg8mhh3GcX_3-zoEhCeb7zU2nlq9TQYFmcQLpZOhL9Xsk9Y6HMs1JChIk4nclNJQ0jiIJAXNrF0trN3D3yV3FFgDKA9840sxL1itihHvZwIqhQ-Kr0XawZcGQ1pJQ85AN-PudrGxSmXLM44GEhAl7AjqTwvLzKYpLo4YK31QNIFZ9V7fYKx87Mx7Cwwf",
        "widthPx": 4800,
        "heightPx": 2700
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ2YYQE4kwhjcQQ-oOzzZSUAAQSV_uogqh3Euep0YRlYW-tmOni9DctXJWuw6fubAdhX2LaKY5dfCzl0jA1_fF2zKXIVEQP3JA4P48QekCGSTM_y3Zo4PbmUFtGyKCkBOZ_dwYa6wJG31OywHeIlzcmmoOwcu5T7025mbK3onxrw7ZjhwaAvFIzEJltl3S2pxaepgughE_9S5O0tvpk8Qk72ZNn2Xu_BaEkH2ZyeJH1S3mBKql4sA8AlVLM1YtJNyaEjBJLCgWhD3u7g8JhV9FcZZXAjLjPF2nR5D1eRfOYlAA",
        "widthPx": 4032,
        "heightPx": 3024
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ27LLU8qXiECQhc8AMvL4cn3xnRLHkqiFtmLcfTGWday6LZ6mS_YZkj0rclf5KXstYNZ8L5nvJa5KnuHyOZZ6ggY6JaW-HDT3d-JiSAk2MP-B4MaoSf2VIj9FPdFwzh_6rrDxLgWwlNNsqtP1QU3JMAjwNd83cBT22_No0yUq5otta9IEBfPGX4mruZW-XGjfprOzHcYgBiyk85XmMUXEJRMJpYBZYzrfbxe-zX8VP79HsKVgO8dByam2UQKJKQCHlngS0SfzH_qY5xlNAsyRN7dYJSpPzEOmIGtGKyFG67yWySgmPxeKCUJJMIG4MyMP6IZCzLJNnjdxVzzxHTzSg152ZuyGFwvUNh6OtTtIM_lAzjNgjasFgQ42oIVfEKHWUnSPLyQjC92TIeiPj6NeLS_wM2M23VeMIRPyHaInLAng",
        "widthPx": 3024,
        "heightPx": 4032
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ1Fqvs9qNnGVz8ayae8Xh58KQYSPD6dTnztWmQYGPX2S_FeF4QoAhQ8vqtDf6-Ka_s8rFCS03d4Ny1Vf2dHR-NPub3oy46pWXml3SUcNm6vgTvLYzDn-7cY6DkE6Blpkj-zEFBN7_TD0v8SlKHl4aFxD8wKFBSIpPjK9_eVkq-3yVWS23c0kKkoe5ZlBzUQmAvMkpXx1MmEPKD0FvLyfdsCP-0Rhe3NarNnUMp_sBEJtbsR5WgEP9xNJVGU1ErqURN6v0ZrMX9GR1gXOxjF8K4kMPdCXd4wxZS1EfbcKEsPBIlf9CkEh6m3yVajXGDhQkl_bXbMzm-bqbLLsnG2Icy3X74o6ZyWN3-znNvr7_9U-7o5-md_OGAJoprMfTkGB5ZEKHEkbZd9JshHLCGcH3rSkbskLN4Nk3B2IqZgLMGTOA",
        "widthPx": 4800,
        "heightPx": 2700
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ1Wa1spZQER_0RQRuGYHcYVGeutqRfeUTupji9ho8k2A26I-JetkNZiJ2lYIbuSKC25FEAAcnX54MtCvO70CGFysS2Qjw3VVZPuhui34Nu7ODzTrLKPwXVUahA6tv4uenuyY06XV4IxlJCWcVMTgkS1tfTjMpzdfif7B2su9kczhfet8di_0oiNQIN_Zf7QLdYotPxNQTB5vaUsYYIkzhry36jlFUkTo0oJiMdVR0_u_L9U7rjo-JHKMS4eelGDxVvYcznqE8pVPr8KrVx-4LWWIVGDIBqR33oW5kdSGmJKSk1_sGJeqm6EHFLYwHwMQMZVsTPGRfQnk7A7Nx7ed7h7mP53WvbEeleKDKAsfr0VTXb1FEYyKRlUKoDF6l1Qrv6dCvli1mGWvcNOhQx3uYwIXY2Mi4e72N7nkNq9yCbwmw",
        "widthPx": 3024,
        "heightPx": 4032
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ3wYO-YWKPmC9-zB38af6Mjy9ZChKCmQbvJtS2VuL23YF2ZK5as4KLOeqER6vJm24aayhOhXg_zp7qyQEvZQezQ79OmpnxrtOqfmLYkE_RTduJfLySj-OCUTqSd8ylFkX5oQlxtSyD5WweMFPbp3SDawjndlnczJp30KzFzzdTnI5Jgp_B4PYDbwy0asrxpGHfvuc2v4Ib3PTmmpvNf7n7h7JN4lpFA_UPbhVJqXSatVFiDDsSODxyiVxjtiFTSWwW6N_tDqDLpbgYevd1KKZfmPiu8hdpjxmHGCoJaHbPnlPn1EBF_ckfNMKTeUeIfwx3xSkvbAfPTEqHQuTPSMmVsyUv8t8L1Oy-_JbLPEVlmEelrmFei43oKdjACNmLb7e5swaA0H-VynHvtCBIoR0cLVzUDw-1opH0FIzCzF7hJ8Klg",
        "widthPx": 3024,
        "heightPx": 4032
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ0DNsUg-LTz_O0L2VUu7iAwDTqBEjONGPxwdTB1bXE-36hBQ2JXi4FLDAX-ZpcST8ET2GqFO7wygIMDNxfmXZ18zcw0G2o8ELYZy0-qvMggqomzUnAlfF53E0PkyJ0DC5mgIOi0ISkgvjn6ptejIlcvOEmTLAh7K-DaoVg2u1bDpDByRedFXv3lCALeG1IntYVZfSLgIlcfmo5mQTJeVFVv4pWZj9wqbQ5GDPS2gA-1IgtYEm5b_eXkbwb7LOGmPgeB-LIAAV_oxWUoQNh9rr7buRt-WEyJ5Ksm0H45RWKzdE1y0QQ0BkmQev4dNuoZYq-xjpU65CmH5iDewGV34ZemZBrK7nbSS6UiLvxOu7eMBfRoi8zGjV6p-vFG8S-1KjoJjerEbeiBRsxpcIJlJkiVkxyfOYYPAtPFKB6WeGm8Q_TQ",
        "widthPx": 4032,
        "heightPx": 2533
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ0qXDYKa-ulQFRVrdwW4Ek_KjmAhVWF6mBM0sJs8yGq7uLXbdbLBgqohiMoeqCk-BR4KX6jnjREpEEB5iZYNkrEG4fCegWpxt8TV6s67Wamy_Vw8ZmvF40SbsuXS03paUmvGb9MNCVC2__5jPZdln9SzjX5vMV77Vg_EL0AJevyb9KcG4EWjlQAt883LEBlHb4fKu5y22chUSvE_PHaFGamW2nsYvqzvfbxKNy0ZTOTUhPu_amTRZUR4ulLWq6QjDOjlm-352bf6cCJJfXsd5uCSiJ-pleuzTNibomhzLJl9vMkWxHs2KC7jZsk6NnvymsULdrFUJ6HYJ7SW_q0pEimdC1A0cHlOG_1AEm85QuQ15smFA_qlI9A_ie13X46vHhdk6UxmtpKofSxgQRLP08P3V1LHLJkuiA5WCqO2uFbCHzn",
        "widthPx": 3024,
        "heightPx": 4032
      },
      {
        "name": "places/ChIJUUP02eUM3IARv03jidyvySQ/photos/AUy1YQ34AyK8qtwccgkZ5SwAyIhfEQMEYa2RksRTGHt0GMBB2IoVVeNeCxfNi5EXF4S2XZHOvGIrIVNYEXe2uaP6ZR-1_I61I10d0i3JVErwMOLoNpzNkKoLXDvba5-NlfWclhRMUHl7TySMe61yI403W61ODbiL8BdDE-X4op9fYhVUEcnSfHNB_FVjVLe6ZiXbUO1RXGH76bPwNsRCW7xnOcflH6MJy8vzC8TRn7985rmfcT_ImocYOuEacMcaHuUVnUMPdVRES9d51I6H5N-dQxrfCFmsLmNqr9wOl9WsYlU_S4S3MaDoktoGaxY_vvVmZkWxWrSFzGsERHDelEWu-oIPJ3m3lVsbEbdL5PA5gUIinRQYE7oIa1Ilh7D9zgtrp1TPsCc39bkb3wkqRQ8iicgqO91pbqwfAa1Z-y-ezN5XAMw",
        "widthPx": 4800,
        "heightPx": 2700
      }]
  }'::jsonb);
