<?php declare(strict_types=1); namespace IR\App\Controllers; if (!defined('IR_START')) exit('<pre>No direct script access allowed</pre>');
/**
 * @framework       iResponse Framework 
 * @version         1.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Production.php	
 */

# core 
use IR\Core\Application as Application;

# mvc 
use IR\Mvc\Controller as Controller;

# models
use IR\App\Models\Admin\MtaServer as MtaServer;
use IR\App\Models\Admin\ServerVmta as ServerVmta;
use IR\App\Models\Admin\SmtpServer as SmtpServer;
use IR\App\Models\Admin\SmtpUser as SmtpUser;
use IR\App\Models\Admin\ManagementServer as ManagementServer;
use IR\App\Models\Affiliate\AffiliateNetwork as AffiliateNetwork;
use IR\App\Models\Affiliate\Offer as Offer;
use IR\App\Models\Affiliate\FromName as FromName;
use IR\App\Models\Affiliate\Subject as Subject;
use IR\App\Models\Production\Header as Header;
use IR\App\Models\Admin\Isp as Isp;
use IR\App\Models\Lists\DataProvider as DataProvider;
use IR\App\Models\Affiliate\Vertical as Vertical;
use IR\App\Models\Production\MtaProcess as MtaProcess;
use IR\App\Models\Production\SmtpProcess as SmtpProcess;
use IR\App\Models\Production\AutoResponder as AutoResponder;
use IR\App\Models\Production\Team as Team;
use IR\App\Models\Production\TeamAuthorisation as TeamAuthorisation;
use IR\App\Models\Admin\User as User;
use IR\App\Models\Lists\DataList as DataList;

# helpers 
use IR\App\Helpers\Api as Api;
use IR\App\Helpers\Page as Page;
use IR\App\Helpers\DataTable as DataTable;
use IR\App\Helpers\Permissions as Permissions;
use IR\App\Helpers\Authentication as Authentication;

# http 
use IR\Http\Request as Request;

# exceptions
use IR\Exceptions\Types\PageException as PageException;

/**
 * @name Production
 * @description Production Controller
 */
class GProduction extends Controller
{
    /**
     * @app
     * @readwrite
     */
    protected $app;
    
    /**
     * @app
     * @readwrite
     */
    protected $authenticatedUser;

    /**
     * @name init
     * @description initializing process before the action method executed
     * @once
     * @protected
     */
    public function init() 
    {
        # set the current application to a local variable
        $this->app = Application::getCurrent();
        
        # connect to the database 
        $this->app->database('system')->connect();
        
        # check for authentication
        if(!Authentication::isUserAuthenticated())
        {
            Page::redirect($this->app->http->request->getBaseURL() . RDS . 'auth' . RDS . 'login.' . DEFAULT_EXTENSION);
        }

        # check users roles 
        Authentication::checkUserRoles();
        
        # get the authenticated user
        $this->authenticatedUser = Authentication::getAuthenticatedUser();
    }
    
    /**
     * @name main
     * @description the main action
     * @before init
     * @after closeConnections
     */
    public function main() 
    { 
        Page::redirect($this->app->http->request->getBaseURL() . RDS . 'GProduction' . RDS . 'gmail-send-process .' . RDS . DEFAULT_EXTENSION);
    }

    public function GmailSendProcess() 
    { 
        
        $this->init();
       

        # check for permissions 
        $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,__FUNCTION__);

        if($access == false)
        {
            throw new PageException('Access Denied !',403);
        } 

       
        
        $arguments = func_get_args(); 
        $processType = isset($arguments) && count($arguments) > 0 ? $arguments[0] : null;
        $processId = isset($arguments) && count($arguments) > 1 ? $arguments[1] : null;

        # set data to the page view
        $this->pageView->set([
          "name" => "simo"
        ]); 

        
       

    }

    


 
}