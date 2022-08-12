import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer, useField, useForm } from '@formily/react';
import Search from '@src/components/search';
interface SearchInput{
}
const SearchInput=observer((props:SearchInput)=>{
  const field = useField()
  const form = useForm()
  const fieldName=field.path.entire.toString();
  return <>
    <Search placeholder={field.title} paramName={fieldName} params={form.values} setParams={form.setValues}  /> </>
}) 
export default SearchInput;