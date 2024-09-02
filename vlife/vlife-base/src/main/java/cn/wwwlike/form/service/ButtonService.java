package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.ButtonDao;
import cn.wwwlike.form.entity.Button;
import cn.wwwlike.vlife.base.OrderRequest;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class ButtonService  extends VLifeService<Button, ButtonDao> {

    public List<Button> findPositionBtn(Button button){
        QueryWrapper<Button> qw=QueryWrapper.of(Button.class);
        qw.eq("sysMenuId",button.getSysMenuId()).eq("position",button.getPosition());
        OrderRequest order = new OrderRequest();
        order.addOrder("sort", Sort.Direction.ASC);
        return dao.query(Button.class,qw,order);
    }

    public Integer getSort(Button button){
        List<Button> buttons= findPositionBtn(button);
        if(buttons.size()==0){
            return 0;
        }
        //获得最后一个按钮的排序号+1
        return buttons.get(buttons.size()-1).getSort()+1;
    }


    //上移下移
    public void move(Button button,String opt){
        List<Button> buttons= findPositionBtn(button);
        int index= IntStream.range(0, buttons.size())
                .filter(i -> buttons.get(i).getId() .equals(button.getId()))
                .findFirst()
                .orElse(-1);
        Button currBtn=buttons.get(index);
        Button targetBtn=null; // 需要互换的btn
        if(index>0&&opt.equals("up")){
            //上一个btn
            targetBtn=  buttons.get(index-1);
        } else if(index>=0&& index !=buttons.size()-1&&opt.equals("down")){
            //下一个btn
            targetBtn=  buttons.get(index+1);
        }
        if(targetBtn!=null){
            currBtn.setSort(targetBtn.getSort());
            targetBtn.setSort(button.getSort());
            save(currBtn);
            save(targetBtn);
        }
    }
}
